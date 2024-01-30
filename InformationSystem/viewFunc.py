import mariadb

#Expenses made within a month
def viewType1(cur):
    try:
        cur.execute(
            'SELECT * FROM transaction WHERE datediff(curdate(), date_of_transaction) < 31'
        ) 
        checker = cur.fetchall()
        if len(checker) != 0:
            for (transaction_id, date, value, outstanding_balance, payer_id, type, is_settled) in checker:
                print(f'\tTransaction ID: {transaction_id}')
                print(f'\tDate: {date}')
                print(f'\tValue: {value}')
                print(f'\tOutstanding Balance: {outstanding_balance}')
                print(f'\tPayer ID: {payer_id}')
                print(f'\tType: {type}')
                print(f'\tIs Settled: {is_settled}')
                print()
        else:
            print("\n>>> No available data.")

    except mariadb.Error as e:
        print(f'Error: {e}')

   
#Expenses made with a friend
def viewType2(cur):
    
    ids = []
    try:
        cur.execute(
            'SELECT person_id, first_name, middle_name, last_name FROM person WHERE person_id != 1'
        )
        checker = cur.fetchall()
        if len(checker) != 0:
            for (person_id, first_name, middle_name, last_name) in checker:
                ids.append(str(person_id))
                print(f'\tPerson ID: {person_id}')
                print(f'\tFirst Name: {first_name}')
                print(f'\tMiddle Name: {middle_name}')
                print(f'\tLast Name: {last_name}')
                print()
        else:
            print("\n>>> No friends found.")
            return
    except mariadb.Error as e:
        print(f'Error: {e}')
    
    friend_id = ''
    while friend_id not in ids:
        friend_id = input('\n>>> Enter friend ID: ')
        if friend_id not in ids:
            print('>>> Invalid Input!')

    try:
        cur.execute(
            'SELECT * FROM transaction NATURAL JOIN person_has_transaction WHERE person_id = ?',
            (friend_id,)
        )
        checker2 = cur.fetchall()
        if len(checker2) != 0:
            for item in checker2:
                print(f'\tTransaction ID: {item[0]}')
                print(f'\tDate: {item[1]}')
                print(f'\tValue: {item[2]}')
                print(f'\tOutstanding Balance: {item[3]}')
                print(f'\tPayer ID: {item[4]}')
                print(f'\tType: {item[5]}')
                print(f'\tIs Settled: {item[6]}')
                print()
        else:
            print("\n>>> No transactions made with this friend.")
            
    except mariadb.Error as e:
        print(f'Error: {e}')

 

def viewType3(cur):
    try:
        cur.execute(
            'SELECT * FROM circle'
        )
        checker = cur.fetchall()
        if len(checker) != 0:
            for (circle_id, circle_name) in checker:
                print(f'\tGroup ID: {circle_id}')
                print(f'\tGroup name: {circle_name}')

            group_id = input("\n>>> Enter group ID: ")

            cur.execute("SELECT * FROM transaction NATURAL JOIN circle_has_transaction WHERE circle_id = ?",(group_id,))

            checker2=cur.fetchall()
            if len(checker2) != 0:
                for item in checker2:
                    print(f'\tTransaction ID: {item[0]}')
                    print(f'\tDate: {item[1]}')
                    print(f'\tValue: {item[2]}')
                    print(f'\tOutstanding Balance: {item[3]}')
                    print(f'\tPayer ID: {item[4]}')
                    print(f'\tType: {item[5]}')
                    print(f'\tIs Settled: {item[6]}')
                    print()
            else:
                print("\n>>> Group does not exist.")
       
        else:
            print("\n>>> No expenses made with a group.")
    except mariadb.Error as e:
        print(f'Error: {e}')

# View Current Balance from all expenses
def viewType4(cur):
        try:
            cur.execute("SELECT person_id, first_name, middle_name, last_name FROM person")
            checker = cur.fetchall()
            print()
            if len(checker)!=0:
                for (person_id, first_name, middle_name, last_name) in checker:
                    print(f'Person ID: {person_id}')
                    print(f'First Name: {first_name}')
                    print(f'Middle Name: {middle_name}')
                    print(f'Last Name: {last_name}')
                    print()

                toSearch = input('\n>>> Enter ID to view current balance: ')

                cur.execute(
                    'SELECT * FROM person WHERE person_id = ?',
                    (toSearch,)
                )

                # Print!
                searchedFriend = cur.fetchone()
                if searchedFriend:
                    try:
                        cur.execute("SELECT total_outstanding_balance FROM person WHERE person_id = ?", (toSearch,))
                        currentBalance = cur.fetchone()
                        print(f"\n>>> {searchedFriend[2]} {searchedFriend[4]} current balance: {currentBalance[0]} pesos")
                    except mariadb.Error as e:
                        print(f'Error: {e}')
                else:
                    print("\n>>> User not found!")
            else:
                print("\n>>> No available data!")
        except mariadb.Error as e:
            print(f'Error: {e}')

# View all friends with outstanding balance
def viewType5(cur):
    try:
        cur.execute("SELECT * FROM person WHERE person_id != 1 AND total_outstanding_balance != 0")
        checker = cur.fetchall()
        if len(checker)!=0:
            print("\n>>> Here are all the friends with outstanding balance")
            for (person_id, total_outstanding_balance, first_name, middle_name, last_name) in checker:
                print(f'Person ID: {person_id}')
                print(f'Total Outstanding Balance: {total_outstanding_balance}')
                print(f'First Name: {first_name}')
                print(f'Middle Name: {middle_name}')
                print(f'Last Name: {last_name}')
                print()
        else:
            print("\n>>> No friends to show.")
    except mariadb.Error as e:
        print(f'Error: {e}') 

def viewType6(cur):
    try:
        cur.execute("SELECT * FROM circle")
        checker = cur.fetchall()
        if len(checker)!=0:
            print("\n>>> All groups")
            print()
            for (circle_id, circle_name) in checker:
                print(f'\tGroup ID: {circle_id}')
                print(f'\tGroup Name: {circle_name}')
                print()
        else:
            print("\n>>> No groups to show.")
    except mariadb.Error as e:
        print(f'Error: {e}') 

def viewType7(cur):
    try:
        cur.execute("SELECT * FROM circle natural join (select circle_id, sum(outstanding_balance) as ‘circle_balance’ from transaction natural join circle_has_transaction group by circle_id) temp")
        checker = cur.fetchall()
        if len(checker)!=0:
            print("\n>>> Here are all the groups with outstanding balance")
            print()
            for (circle_id, circle_name, circle_balance) in checker:
                print(f'\tGroup ID: {circle_id}')
                print(f'\tGroup Name: {circle_name}')
                print(f'\tOutstanding Balance: {circle_balance}')
            print()
        else:
            print("\n>>> No groups with outstanding balance.")
    except mariadb.Error as e:
        print(f'Error: {e}') 
