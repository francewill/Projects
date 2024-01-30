import mariadb
import sys
import printFunc
import transactionFunc
import friendsFunc
import groupFunc

import viewFunc
    
# Server connection
try:
    conn = mariadb.connect(
        user = 'end_user',
        password = 'cmsc127',
        host = 'localhost',
        port = 3306,
        database = 'cmsc127'
    )
    print("Mysql Database Connection Successful\n")
except mariadb.Error as e:
    print(f'Error connecting to MariaDB Platform: {e}')
    sys.exit(1)
# Create mysql_python
cur = conn.cursor()

print("\n|***** WELCOME *****|")
print("\n>>> I'm WALL-ET")
print(">>> A small, curious, and diligent robot who is always ready\nto help in managing your finances!")
while True:
    cur.execute("SELECT * FROM person")
    checker = cur.fetchall()
    if len(checker) == 0:
        print("\n>>> Let's create your account!\n")

        first_name = input("\n>>> Enter your first name: ")
        middle_name = input("\n>>> Enter your middle name: ")
        last_name = input("\n>>> Enter your last name: ")
        total_outstanding_balance = 0 # initial value

        try:
            # Inserting values
            cur.execute(
                'INSERT INTO person values(NULL, ?, ?, ?, ?)',
                (total_outstanding_balance, first_name, middle_name, last_name)
            )
            # For id
            person_id = cur.lastrowid
        except mariadb.Error as e:
            print(f'Error: {e}')
        conn.commit()


    choice = printFunc.mainMenu()
    performOrView = printFunc.subMenu(choice)
    
    # Asks what to perform in Transaction
    if performOrView == '1func':
        option = printFunc.funcToPerform("Transaction")
        # Add transaction
        if option == '1':
            transactionFunc.addTransaction(cur)
            conn.commit()
        # Delete transaction
        elif option == '2':
            transactionFunc.deleteTransaction(cur)
            conn.commit()
        # Search transaction
        elif option == '3':
            transactionFunc.searchTransaction(cur)
        # Update transaction
        elif option == '4':
            transactionFunc.updateTransaction(cur,conn)
        else:
            print("\n>>> Invalid Input!")

    # Ask what to perform in Person
    elif performOrView =="2func":
        option = printFunc.funcToPerform("Friend")
        # For add friend
        if option == "1":
            friendsFunc.addFriend(cur)
            conn.commit()

        # For deleting
        elif option == "2":
            friendsFunc.deleteFriend(cur)
            conn.commit() 

        # For searching       
        elif option == "3":
            friendsFunc.searchFriend(cur)

        # For update
        elif option == "4":
            friendsFunc.updateFriend(cur,conn)
        else:
            print("\n>>> Invalid Input!")
    
    # Ask what to perform in Circle (group)
    elif performOrView == "3func":
        option = printFunc.funcToPerform("Group")
        if option == "1":
            groupFunc.addGroup(cur)
            conn.commit()

        elif option == "2":
            groupFunc.deleteGroup(cur)
            conn.commit()
        elif option == "3":
            groupFunc.searchGroup(cur)
            conn.commit()
        elif option == "4":
            groupIsEmpty = groupFunc.isEmpty(cur)

            if groupIsEmpty:
                print(">>> No groups yet!")
            else:
                print("\n>>> What do you want to update?")
                print("[1] Group Name")
                print("[2] Add Members")
                change = input("\n>>> Enter your choice here: ")

                groupFunc.updateGroup(cur,conn,change)
        else:
            print("\n>>> Invalid Input!")

    # Go back to main menu
    elif performOrView == "4func":
        pass

    #Expenses made within a month
    elif performOrView == '1view':
        viewFunc.viewType1(cur)

    #Expenses made with a friend
    elif performOrView == '2view':
        viewFunc.viewType2(cur)

    # View All expenses made with a group
    elif performOrView == '3view':        
        viewFunc.viewType3(cur)

    # View Current Balance from all expenses
    elif performOrView == '4view':
        viewFunc.viewType4(cur)

    # View all friends with outstanding balance    
    elif performOrView == '5view':
        viewFunc.viewType5(cur)

    elif performOrView == '6view':
        viewFunc.viewType6(cur)
    elif performOrView == '7view':
        viewFunc.viewType7(cur)
    elif performOrView == '8view':
        pass
   
    elif choice == '0':
        cur.close()
        conn.close()
        sys.exit(0)
    else:
        print('\n>>> Invalid Choice!')