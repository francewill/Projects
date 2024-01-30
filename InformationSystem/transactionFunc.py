
import mariadb
import groupFunc

def isEmpty(cur):
    try:
        cur.execute("SELECT * FROM transaction")

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

def addTransaction(cur):
    print()
    print('[1] Transaction with Friend')
    print('[2] Transaction with Group')
    print()

    option = input('>>> Enter your choice here: ')
    print()

    if option == '1':
        isOnePerson = groupFunc.onePerson(cur)

        if isOnePerson:
            print(">>> Cannot make transaction without friends!")
        else: 
            cur.execute(
            'SELECT person_id, first_name, middle_name, last_name FROM person'
            )

            ids = []
            for (person_id, first_name, middle_name, last_name) in cur:
                print(f'[{person_id}] {first_name} {middle_name} {last_name}')
                ids.append(str(person_id))

            person = 0
            while person not in ids:
                for (person_id, first_name, middle_name, last_name) in cur:
                    print(f'[{person_id}] {first_name} {middle_name} {last_name}')

                person = input('\n>>> Enter ID of person with transaction: ')
                if person not in ids:
                    print('>>> Invalid ID!')

            value = 0
            outstanding_balance = 0
            payer = 0

            transaction_type = ''

            while transaction_type != 'expense' and transaction_type != 'settlement':
                transaction_type = input('\n>>> Enter transaction type (expense/settlement): ').lower()

                if transaction_type != 'expense' and transaction_type != 'settlement':
                    print('>>> Invalid Input!')

            if transaction_type == 'expense':
                payer = 0
                while payer not in ids:
                    payer = input('\n>>> Enter payer ID: ')

                    if payer not in ids:
                        print('>>> Invalid Input!')
                if person != payer:
                    value = input('\n>>> Enter total transaction value: ')
                    outstanding_balance = float(value) / 2

                    try:
                        cur.execute(
                            'INSERT INTO transaction values(NULL, CURDATE(), ?, ?, ?, ?, ?)',
                            (value, -outstanding_balance, payer, transaction_type, 0,)
                        )

                        transaction_id = cur.lastrowid

                        cur.execute(
                            'INSERT INTO person_has_transaction values(?, ?)',
                            (person, transaction_id)
                        )

                        cur.execute(
                            'UPDATE person SET total_outstanding_balance = total_outstanding_balance - ? WHERE person_id = ?',
                            (outstanding_balance, person)
                        )

                        cur.execute(
                            'UPDATE person SET total_outstanding_balance = total_outstanding_balance + ? WHERE person_id = ?',
                            (outstanding_balance, payer)
                        )

                        print()
                        print('>>> Successfully added transaction!')
                    except mariadb.Error as e:
                        print(f'Error: {e}')
                else:
                    print("\n>>> You can't enter same id in a transaction.")

            elif transaction_type == 'settlement':
                try:
                    #get unsettled expenses
                    cur.execute(
                        'SELECT transaction_id, date_of_transaction, value, outstanding_balance FROM transaction NATURAL JOIN person_has_transaction WHERE is_settled = 0 AND person_id = ?',
                        (person,)
                    )

                    data = cur.fetchall()

                    if len(data) == 0:
                        print(">>> This person has no unsettled expenses.")
                        return

                    expense_ids = []
                    for (expense_id, expense_date, expense_value, expense_outstanding_balance) in data:
                        expense_ids.append(str(expense_id))
                    
                    print()
                    
                    to_settle = 0
                    while to_settle not in expense_ids:
                        for (expense_id, expense_date, expense_value, expense_outstanding_balance) in data:
                            #print unsettled expenses
                            print(f'[{expense_id}] Date: {expense_date} | Value: {expense_value} | Outstanding Balance: {expense_outstanding_balance}')

                        print()
                        to_settle = input('>>> Select expense to settle: ')

                        if to_settle not in expense_ids:
                            print('>>> Invalid Input!')
                        print()

                    #get expense to settle
                    cur.execute(
                        'SELECT value, outstanding_balance, payer_id FROM transaction WHERE transaction_id = ?',
                        (to_settle,)
                    )

                    for (expense_value, expense_outstanding_balance, expense_payer_id) in cur:
                        value = expense_value
                        outstanding_balance = -expense_outstanding_balance
                        payer = expense_payer_id

                    #add settlement transaction
                    cur.execute(
                        'INSERT INTO transaction values(NULL, CURDATE(), ?, ?, ?, ?, NULL)',
                        (value, outstanding_balance, person, transaction_type)
                    )

                    transaction_id = cur.lastrowid

                    #update expense as settled
                    cur.execute(
                        'UPDATE transaction SET is_settled = 1 WHERE transaction_id = ?',
                        (to_settle,)
                    )

                    cur.execute(
                        'INSERT INTO person_has_transaction values(?, ?)',
                        (person, transaction_id)
                    )
                    
                    cur.execute(
                        'UPDATE person SET total_outstanding_balance = total_outstanding_balance + ? WHERE person_id = ?',
                        (outstanding_balance, person)
                    )

                    cur.execute(
                        'UPDATE person SET total_outstanding_balance = total_outstanding_balance - ? WHERE person_id = ?',
                        (outstanding_balance, payer)
                    )

                    print('>>> Successfully settled expense!')
                except mariadb.Error as e:
                    print(f'Error: {e}')
    elif option == '2':
        noGroup = groupFunc.isEmpty(cur)

        if noGroup:
            print(">>> Cannot make transaction with no group!")
        else:
            #get groups
            cur.execute(
                'SELECT circle_id, circle_name FROM circle'
            )

            groups = cur.fetchall()

            #print groups
            circle_ids = []
            for (circle_id, circle_name) in groups:
                circle_ids.append(str(circle_id))

            group_id = 0
            while group_id not in circle_ids:
                for (circle_id, circle_name) in groups:
                    print(f'[{circle_id}] {circle_name}')
                print()

                group_id = input('>>> Select group to make transaction with: ')
                if group_id not in circle_ids:
                    print('>>> Invalid Input!')
                print()

            payer = 0
            transaction_type = ''

            while transaction_type != 'expense' and transaction_type != 'settlement':
                transaction_type = input('\n>>> Enter transaction type (expense/settlement): ').lower()

                if transaction_type != 'expense' and transaction_type != 'settlement':
                    print('>>> Invalid Input!')

            print()

            if transaction_type == 'expense':
                #get group members
                cur.execute(
                    'SELECT person_id, first_name, middle_name, last_name FROM person NATURAL JOIN person_joins_circle WHERE circle_id = ?',
                    (group_id,)
                )

                data = cur.fetchall()

                member_ids = []
                for (person_id, first_name, middle_name, last_name) in data:
                    member_ids.append(str(person_id))

                while payer not in member_ids:
                    #print group members
                    for (person_id, first_name, middle_name, last_name) in data:
                        print(f'[{person_id}] {first_name} {middle_name} {last_name}')
                    print()
                    payer = input('>>> Enter Payer ID: ')

                    if payer not in member_ids:
                        print('>>> Invalid Input!')
                    print()

                value = input('>>> Enter total transaction value: ')
                outstanding_balance = float(value) - (float(value) / len(member_ids))

                #insert new transaction
                cur.execute(
                    'INSERT INTO transaction VALUES(NULL, CURDATE(), ?, ?, ?, ?, ?)',
                    (value, -outstanding_balance, payer, transaction_type, 0,)
                )

                transaction_id = cur.lastrowid

                #insert circle_has_transaction
                cur.execute(
                    'INSERT INTO circle_has_transaction VALUES(?, ?)',
                    (group_id, transaction_id)
                )

                #update total oustanding balance of members
                for id in member_ids:
                    if id == payer:
                        continue

                    cur.execute(
                        'UPDATE person SET total_outstanding_balance = total_outstanding_balance - ? WHERE person_id = ?',
                        (outstanding_balance / (len(member_ids) - 1), id)
                    )

                #update total oustanding balance of payer
                cur.execute(
                    'UPDATE person SET total_outstanding_balance = total_outstanding_balance + ? WHERE person_id = ?',
                    (outstanding_balance, payer)
                )

                print('>>> Successfully added group expense!')
            elif transaction_type == 'settlement':
                #get groups with unsettled expenses
                cur.execute(
                    'SELECT transaction_id, circle_name, outstanding_balance FROM circle NATURAL JOIN (SELECT * FROM circle_has_transaction NATURAL JOIN transaction WHERE is_settled = 0 AND circle_id = ?) a',
                    (group_id,)
                )

                data = cur.fetchall()

                if (len(data ) == 0):
                    print(">>> This group has no unsettled expenses")
                    return

                transaction_ids = []
                for (transaction_id, circle_name, outstanding_balance) in data:
                    transaction_ids.append(str(transaction_id))

                to_settle = '0'
                while to_settle not in transaction_ids:
                    for (transaction_id, circle_name, outstanding_balance) in data:
                        print(f'[{transaction_id}] {circle_name} | Outstanding Balance: {outstanding_balance}')
                    print()

                    to_settle = input('>>> Select group expense to settle: ')
                    if to_settle not in transaction_ids:
                        print('>>> Invalid Input!')
                    print()

                #get group members
                cur.execute(
                    'SELECT person_id FROM person_joins_circle NATURAL JOIN circle_has_transaction WHERE transaction_id = ?',
                    (to_settle,)
                )

                member_ids = []

                for (member_id,) in cur:
                    member_ids.append(member_id)

                #get expense information
                cur.execute(
                    'SELECT value, outstanding_balance, payer_id FROM transaction WHERE transaction_id = ?',
                    (to_settle,)
                )

                for expense_value, expense_outstanding_balance, payer_id in cur:
                    value = expense_value
                    outstanding_balance = -expense_outstanding_balance
                    payer = payer_id

                for member_id in member_ids:
                    if member_id == payer:
                        continue
                    
                    #insert settlement transaction for each member
                    cur.execute(
                        'INSERT INTO transaction values(NULL, CURDATE(), ?, ?, ?, ?, NULL)',
                        (value, outstanding_balance / (len(member_ids) - 1), member_id, transaction_type)
                    )

                    transaction_id = cur.lastrowid

                    cur.execute(
                        'SELECT circle_id FROM circle_has_transaction WHERE transaction_id = ?',
                        (transaction_id,)
                    )

                    for id in cur:
                        circle_id = id


                    #insert transaction for group
                    cur.execute(
                        'INSERT INTO circle_has_transaction VALUES(?, ?)',
                        (circle_id, transaction_id)
                    )
                    
                    #update total_outstanding_balance for each member
                    cur.execute(
                        'UPDATE person SET total_outstanding_balance = total_outstanding_balance + ? WHERE person_id = ?',
                        (outstanding_balance / (len(member_ids) - 1), member_id)
                    )

                #update total_outstanding_balance of payer
                cur.execute(
                    'UPDATE person SET total_outstanding_balance = total_outstanding_balance - ? WHERE person_id = ?',
                    (outstanding_balance, payer)
                )
                
                #update expense as settled
                cur.execute(
                    'UPDATE transaction SET is_settled = 1 WHERE transaction_id = ?', (to_settle,)
                )

                print('>>> Successfully settled group expense!')
    else:
        print('>>> Invalid Input!')

    

def deleteTransaction(cur):
    try:
        transIsEmpty = isEmpty(cur)

        if transIsEmpty:
            print(">>> No transactions yet!")
        else:
            #get settled expenses
            cur.execute(
                'SELECT * FROM transaction WHERE is_settled = 1'
            )

            data = cur.fetchall()
            if len(data) <= 0:
                print('>>> Please settle an expense first before deleting.')
                return
            
            #get settled expenses and settlements
            cur.execute(
                'SELECT * FROM TRANSACTION WHERE is_settled = 1 OR type = "settlement"'
            )

            data = cur.fetchall()
            ids = []

            for (transaction_id, transaction_date, value, outstanding_balance, payer_id, type, is_settled) in data:
                ids.append(str(transaction_id))
            
            
            for (transaction_id, transaction_date, value, outstanding_balance, payer_id, type, is_settled) in data:
                print(f'[{transaction_id}]')
                print(f'\tDate: {transaction_date}')
                print(f'\tValue: {value}')
                print(f'\tOutstanding Balance: {outstanding_balance}')
                print(f'\tPayer ID: {payer_id}')
                print(f'\tTransaction Type: {type}')
                print(f'\tIs Settled: {is_settled}')
            
            toDel = ''
            while toDel not in ids:
                toDel = input('\n>>> Enter transaction ID to Delete: ')
                if toDel not in ids:
                    print('>>> Invalid Input!')

            cur.execute(
                'DELETE FROM transaction WHERE transaction_id = ?',
                (toDel,)
            )

            cur.execute(
                'DELETE FROM person_has_transaction WHERE transaction_id = ?',
                (toDel,)
            )
            cur.execute(
                'DELETE FROM circle_has_transaction WHERE transaction_id = ?',
                (toDel,)
            )

            print('>>> Successfully Deleted Transaction!')
    except mariadb.Error as e:
        print(f'Error: {e}')

def searchTransaction(cur):
    try:
        transIsEmpty = isEmpty(cur)

        if transIsEmpty:
            print(">>> No transactions yet!")
        else:
            option = ''
            while option not in ['1', '2', '3']:
                print('[1] Search by Transaction ID')
                print('[2] Search by Transaction Date')
                print('[3] Search by Type')

                option = input('\n>>> Enter Choice: ')
                if option not in ['1', '2', '3']:
                    print('>>> Invalid Input!')
                    print()

            toSearch = ''
            if option == '1':
                toSearch = input('>>> Input Transaction ID to Search: ')
                cur.execute(
                    'SELECT * FROM transaction WHERE transaction_id = ?',
                    (toSearch,)
                )
            elif option == '2':
                toSearch = input('>>> Input Transaction Date to Search (YYYY/MM/DD): ')
                cur.execute(
                    'SELECT * FROM transaction WHERE date_of_transaction = ?',
                    (toSearch,)
                )
            elif option == '3':
                toSearch = input('>>> Input Transaction Type to Search (expense/settlement): ').lower()
                cur.execute(
                    'SELECT * FROM transaction WHERE type = ?',
                    (toSearch,)
                )

            searchedTransaction = cur.fetchall()
            if searchedTransaction:
                print("\n>>> Transactions found:")
                for transaction in searchedTransaction:
                    print("Transaction ID: ", transaction[0])
                    print("Date of Transaction: ", transaction[1])
                    print("Value: ", transaction[2])
                    print("Outstanding Balance: ", transaction[3])
                    print("Payer Id: ", transaction[4])                    
                    print("Type: ", transaction[5])                    
                    print("Is settled: ", transaction[6])
                    print()
            else:
                print("\n>>> No transactions found.")
    except mariadb.Error as e:
        print(f'Error: {e}')

def updateTransaction(cur,conn):
    try:
        transIsEmpty = isEmpty(cur)

        if transIsEmpty:
            print(">>> No transactions yet!")
        else:
            cur.execute("SELECT * FROM transaction")
            print("\n>>> What transaction do you want to update?")
            for row in cur:
                print(f'\n\tTransaction ID: {row[0]}')
                print(f'\tDate: {row[1]}')
                print(f'\tValue: {row[2]}')
                print(f'\tOutstanding Balance: {row[3]}')
                print(f'\tPayer ID: {row[4]}')
                print(f'\tType: {row[5]}')
                print(f'\tIs Settled: {row[6]}')
                
            toUpdate = input('\n>>> Enter transaction ID to update: ')
            cur.execute("SELECT transaction_id FROM transaction where transaction_id = ?", (toUpdate,))
            existing_Trans = cur.fetchone()
            if existing_Trans:
                newDate = input('\n>>> Enter new transaction date: ')
                cur.execute(
                    'UPDATE transaction SET date_of_transaction = ? WHERE transaction_id = ?',
                    (newDate,toUpdate)
                )
                conn.commit()
                print("\n>>> Date of transaction is updated successfully.")
            else:
                print("\n>>> Transaction ID not found")
    except mariadb.Error as e:
        print(f'Error: {e}')

     