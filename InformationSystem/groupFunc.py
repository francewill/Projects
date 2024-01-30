import string
import mariadb

def isEmpty(cur):
    try:
        cur.execute("SELECT * FROM circle")

        # Fetch one row or fetch all rows
        row = cur.fetchone()
        # rows = cursor.fetchall()

        # Check if the result set is empty
        if row is None:
            return 1
        else:
            return 0
        
    except mariadb.Error as e:
        print(f'Error: {e}')

def onePerson(cur):
    try:
        cur.execute('SELECT * from person')
        row = cur.fetchone()

        # Check if the result set has only one row
        # row is not None checks if it returned a row
        # cur.fetchone() is None checks if the next row is empty
        ## meaning it only returned one row
        if row is not None and cur.fetchone() is None:
            return 1
        else:
            return 0
    except mariadb.Error as e:
                print(f'Error: {e}')

    

def addGroup(cur):

    #check if there is only one person, if true, cannot create group
    #prompt
    isOnePerson = onePerson(cur)
    
    try:
        if isOnePerson:
            print(">>> Cannot create group with only one person!")
        else:
            circle_name = input("\n>>> Enter group name: ")

            # printing all person
            cur.execute(
                'SELECT * FROM person'
            )
            checker = cur.fetchall()
            if len(checker) >1:
                for item in checker:
                    print(f"\n\tPerson ID: {item[0]}")
                    print(f"\tTotal Outstanding Balance: {item[1]}")
                    print(f"\tFirst Name: {item[2]}")
                    print(f"\tMiddle Name: {item[3]}")
                    print(f"\tLast Name: {item[4]}")

            group_members = input("\n>>> Enter ID of person to add (Separate by comma, no space): ")

            members = [int(id.strip()) for id in group_members.split(",")]
            valid=True
            #check if all input members exist
            for member in members:
                cur.execute(
                    'SELECT * FROM person WHERE person_id = ?',
                    (member,)
                    )
                toAdd = cur.fetchone()
                if toAdd is None:
                    valid = False
                    break
            
            if valid:
                # Inserting values
                cur.execute(
                    'INSERT INTO circle values(NULL,?)',
                    (circle_name,)
                )

                circle_id = cur.lastrowid

                for member in members:
                    
                    cur.execute(
                    'SELECT * FROM person WHERE person_id = ?',
                    (member,)
                    )
                    
                    # Print!
                    toAdd = cur.fetchone()
                    if toAdd:
                        cur.execute("INSERT INTO person_joins_circle values (?,?)",
                        (member, circle_id))
                        print("Successfully added", toAdd[0], "to group.")
                        
                    else:
                        print(member, "not found!")
                
                print("\n>>> Successfully created group")   
            else:
                print("\n>>> Group not created. Invalid person ID!")
    except mariadb.Error as e:
        print(f'Error: {e}')

def deleteGroup(cur):
    try:
        groupIsEmpty = isEmpty(cur)

        if groupIsEmpty:
            print(">>> No groups yet!")
        else:
            cur.execute(
                'SELECT * FROM circle'
            )
            # printing all groups
            for item in cur:
                print(f"\n\tGroup ID: {item[0]}")
                print(f"\tGroup Name: {item[1]}")
                

            toDel = input('\n>>> Enter Group ID to Delete: ')

            cur.execute(
                'SELECT * FROM circle WHERE circle_id = ?',
                (toDel,)
            )
            willDelete = cur.fetchone()
            if willDelete:
                cur.execute(
                    'select outstanding_balance from circle_has_transaction natural join transaction where circle_id = ?',
                    (toDel,)
                )
                notSettled = cur.fetchone()
                if (notSettled[0] !=0 and notSettled is not None) or notSettled is None:
                        print("\n>>> You can't delete a group with pending transaction")
                else:
                    cur.execute(
                        'SELECT transaction_id, circle_name, outstanding_balance FROM circle NATURAL JOIN (SELECT * FROM circle_has_transaction NATURAL JOIN transaction WHERE is_settled = 0) a')
                    checker = cur.fetchall()
                    if len(checker) == 0:
                            
                    # Delete the group
                        cur.execute(
                            'DELETE FROM circle WHERE circle_id = ?',
                            (toDel,)
                        )
                        # Delete in circle_has_transaction
                        cur.execute(
                            'DELETE FROM circle_has_transaction WHERE circle_id = ?',
                            (toDel,)
                        )
                        # Delete in person_joins_circle
                        cur.execute(
                            'DELETE FROM person_joins_circle WHERE circle_id = ?',
                            (toDel,)
                        )

                        print("\n>>> Deleted successfully")    
                    else:
                        print("\n>>> Failed to delete. This group has unsettled expenses")                
            else:
                print("\n>>> Group not found!")
    except mariadb.Error as e:
        print(f'Error: {e}') 

def searchGroup(cur):
    try:
        groupIsEmpty = isEmpty(cur)

        if groupIsEmpty:
            print(">>> No groups yet!")
        else:
            toSearch = input('\n>>> Enter Group ID to Search: ')

            cur.execute(
                'SELECT * FROM circle WHERE circle_id = ?',
                (toSearch,)
            )
            
            # Print!
            searchedGroup = cur.fetchone()
            if searchedGroup:
                print("\n>>> Group found:")
                print("Group ID: ", searchedGroup[0])
                print("Group Name: ", searchedGroup[1])
            else:
                print("\n>>> Group not found!")
            
    except mariadb.Error as e:
        print(f'Error: {e}')

def updateGroup(cur,conn,toUpdate):
    if toUpdate == "1":
        try:
            cur.execute("SELECT * FROM circle")
            print("\n>>> Which group do you want to update?")
            for item in cur:
                print(f"\n\tGroup ID: {item[0]}")
                print(f"\tGroup Name: {item[1]}")
   
            toUpdate = input('\n>>> Enter Group ID of Group to update: ')
            
            # Check if group exist
            cur.execute('SELECT circle_id FROM circle WHERE circle_id = ?', (toUpdate,))
            existing_group = cur.fetchone()
            if existing_group:
                newName = input('\n>>> Enter new group name: ')
                cur.execute('UPDATE circle SET circle_name = ? WHERE circle_id = ?', (newName, toUpdate))
                conn.commit()
                print("\n>>> Group name updated successfully.")
            else:
                print("\n>>> Group ID not found.")

        except mariadb.Error as e:
            print(f'Error: {e}')

    elif toUpdate == "2":
            try:
                cur.execute("SELECT * FROM circle")
                print("\n>>> Which group do you want to update?")
                for item in cur:
                    print(f"\n\tGroup ID: {item[0]}")
                    print(f"\tGroup Name: {item[1]}")
                toUpdate = input('\n>>> Enter Group ID of Group to update: ')

                # Check if group exist
                cur.execute('SELECT circle_id FROM circle WHERE circle_id = ?', (toUpdate,))
                existing_group = cur.fetchone()
                if existing_group:
                    cur.execute(
                        'SELECT * FROM circle_has_transaction NATURAL JOIN transaction WHERE circle_id = ? AND is_settled = 0',
                        (existing_group[0],)
                    )

                    unsettled = cur.fetchall()

                    if len(unsettled) > 0:
                        print('\n>>> Cannot add member while the group still has unsettled expenses')
                        return

                    newMembers = input('\n>>> Enter ID of new members: ')


                    members = [int(id.strip()) for id in newMembers.split(",")]
            
                    for member in members:
                        
                        cur.execute(
                        'SELECT * FROM person WHERE person_id = ?',
                        (member,)
                        )
                        
                        # Print!
                        toAdd = cur.fetchone()
                        if toAdd:
                            cur.execute("INSERT INTO person_joins_circle values (?,?)",
                            (member, toUpdate))
                            print("Successfully added", toAdd[0], "to group.")
                            
                        else:
                            print(member, "not found!") 

                    conn.commit()
                    print("\n>>> Group members updated successfully.")
                else:
                    print("\n>>> Group ID not found.")

            except mariadb.Error as e:
                print(f'Error: {e}')
    else:
        print("\n>>> Invalid Input!")
