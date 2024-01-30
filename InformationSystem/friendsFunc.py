import mariadb
import groupFunc



def addFriend(cur):

    first_name = input("\n>>> Enter friend's first name: ")
    middle_name = input("\n>>> Enter friend's middle name: ")
    last_name = input("\n>>> Enter friend's last name: ")
    total_outstanding_balance = 0 # initial value

    try:
        # Inserting values
        cur.execute(
            'INSERT INTO person values(NULL, ?, ?, ?, ?)',
            (total_outstanding_balance, first_name, middle_name, last_name)
        )
        
        print("\n>>> Friend successfully added.")
    except mariadb.Error as e:
        print(f'Error: {e}')

def deleteFriend(cur):
    try:
        noFriends = groupFunc.onePerson(cur)
        if noFriends:
            print("\n>>> No friends yet!")
        else:
            cur.execute(
                'SELECT * FROM person'
            )
            # printing all person
            checker = cur.fetchall()
            if len(checker) >1:
                for item in checker:
                    if item[0] == 1:
                        continue
                    print(f"\n\tFriend ID: {item[0]}")
                    print(f"\tTotal Outstanding Balance: {item[1]}")
                    print(f"\tFirst Name: {item[2]}")
                    print(f"\tMiddle Name: {item[3]}")
                    print(f"\tLast Name: {item[4]}")
            

            toDel = input('\n>>> Enter Friend ID to Delete: ')
            if toDel !="1":
                cur.execute(
                    'SELECT * FROM person WHERE person_id = ?',
                    (toDel,)
                )
                willDelete = cur.fetchone()
                if willDelete:
                    if willDelete[1] !=0:
                        print("\n>>> You can't delete friend with pending transaction")
                    else:
               
                    # Delete the person
                        cur.execute(
                            'DELETE FROM person WHERE person_id = ?',
                            (toDel,)
                        )
                        # Delete in person_has_transaction
                        cur.execute(
                            'DELETE FROM person_has_transaction WHERE person_id = ?',
                            (toDel,)
                        )
                        # Delete in transaction
                        cur.execute(
                            'DELETE FROM person WHERE person_id = ?',
                            (toDel,)
                        )

                        print("\n>>> Deleted successfully")                    
                else:
                    print("\n>>> User not found!")
            else:
                print("\n>>> You can't delete your own account")
    except mariadb.Error as e:
        print(f'Error: {e}') 

def searchFriend(cur):
    try:
        noFriends = groupFunc.onePerson(cur)
        if noFriends:
            print("\n>>> No friends yet!")
        else:
            toSearch = input('\n>>> Enter friend ID to Search: ')

            cur.execute(
                'SELECT * FROM person WHERE person_id = ?',
                (toSearch,)
            )
            
            # Print!
            searchedFriend = cur.fetchone()
            if searchedFriend:
                print("\n>>> User found:")
                print("\tPerson ID: ", searchedFriend[0])
                print("\tTotal Outstanding Balance: ", searchedFriend[1])
                print("\tFirst Name: ", searchedFriend[2])
                print("\tMiddle Name: ", searchedFriend[3])
                print("\tLast Name: ", searchedFriend[4])
            else:
                print("\n>>> User not found!")
                
    except mariadb.Error as e:
        print(f'Error: {e}')

def updateFriend(cur,conn):
    noFriends = groupFunc.onePerson(cur)
    if noFriends:
        print("\n>>> No friends yet!")
    else:
        print("\n>>> What do you want to update?")
        print("[1] First Name")
        print("[2] Middle Name")
        print("[3] Last Name")
        toUpdate = input("\n>>> Enter your choice here: ")
        if toUpdate == "1":
            try:
            
                cur.execute("SELECT * FROM person")
                print("\n>>> Who do you want to update?")
                for item in cur:
                    print(f"\n\tPerson ID: {item[0]}")
                    print(f"\tTotal Outstanding Balnce: {item[1]}")
                    print(f"\tFirst Name: {item[2]}")
                    print(f"\tMiddle Name: {item[3]}")
                    print(f"\tLast Name: {item[4]}")
                  
                  
                
                toUpdate = input('\n>>> Enter ID to update first name: ')
                
                # Check if user exist
                cur.execute('SELECT person_id FROM person WHERE person_id = ?', (toUpdate,))
                existing_friend = cur.fetchone()
                if existing_friend:
                    newFirst = input('\n>>> Enter new first name: ')
                    cur.execute('UPDATE person SET first_name = ? WHERE person_id = ?', (newFirst, toUpdate))
                    conn.commit()
                    print("\n>>> First name updated successfully.")
                else:
                    print("\n>>> Friend ID not found.")

            except mariadb.Error as e:
                print(f'Error: {e}')

        # Mid name update
        elif toUpdate == "2":
            try:
                cur.execute("SELECT * FROM person")
                print("\nFormat:\nID | Balance | First | Middle | Last")
                for item in cur:
                    print(f"\n\tPerson ID: {item[0]}")
                    print(f"\tTotal Outstanding Balnce: {item[1]}")
                    print(f"\tFirst Name: {item[2]}")
                    print(f"\tMiddle Name: {item[3]}")
                    print(f"\tLast Name: {item[4]}")
                toUpdate = input('\n>>> Enter ID to update middle name: ')
                
                # Check if user exist
                cur.execute('SELECT person_id FROM person WHERE person_id = ?', (toUpdate,))
                existing_friend = cur.fetchone()
                if existing_friend:
                    newMid = input('\n>>> Enter new middle name: ')
                    cur.execute('UPDATE person SET middle_name = ? WHERE person_id = ?', (newMid, toUpdate))
                    conn.commit()
                    print("\n>>> Middle name updated successfully.")
                else:
                    print("\n>>> Friend ID not found.")

            except mariadb.Error as e:
                print(f'Error: {e}')
        
        # Last name update
        elif toUpdate == "3":
            try:
                cur.execute("SELECT * FROM person")
                print("\nFormat:\nID | Balance | First | Middle | Last")
                for item in cur:
                    print(f"\n\tPerson ID: {item[0]}")
                    print(f"\tTotal Outstanding Balnce: {item[1]}")
                    print(f"\tFirst Name: {item[2]}")
                    print(f"\tMiddle Name: {item[3]}")
                    print(f"\tLast Name: {item[4]}")
                toUpdate = input('\n>>> Enter ID to update last name: ')
                
                # Check if user exist
                cur.execute('SELECT person_id FROM person WHERE person_id = ?', (toUpdate,))
                existing_friend = cur.fetchone()
                if existing_friend:
                    newLast = input('\n>>> Enter new last name: ')
                    cur.execute('UPDATE person SET last_name = ? WHERE person_id = ?', (newLast, toUpdate))
                    conn.commit()
                    print("\n>>> Last name updated successfully.")
                else:
                    print("\n>>> Friend ID not found.")

            except mariadb.Error as e:
                print(f'Error: {e}')


        else:
            print("\n>>> Invalid Input!")

