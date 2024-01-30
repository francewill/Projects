
def mainMenu():
    print("\n>>> What do you want to do?")
    print("[1] Perform a Function")
    print("[2] View information")
    print("[0] Exit")
    choice = input("\n>>> Enter your choice here: ")
    return choice

def subMenu(choice):
    if choice == "1":
        print("\n>>> Where do you want to perform a function?")
        print("\n[1] Transaction")
        print("[2] Friend")
        print("[3] Group")
        print("[4] Go Back To Main Menu")
        whereToPerform = input("\n>>> Enter your choice here: ")
        return whereToPerform+"func"
    elif choice == "2":        
        print("\n>>> What do you want to see?")
        print("\n[1] All transactions made within a month.")
        print("[2] All transactions made with a friend.")
        print("[3] All transactions made with a group")
        print('[4] Current balance from all transactions.')
        print('[5] All friends with outstanding balance.')
        print('[6] All groups.')
        print('[7] All groups with an outstanding balance.')
        print("[8] Go Back To Main Menu")
        viewWhat = input("\n>>> Enter your choice here: ")
        return viewWhat+"view"
    elif choice == "0":
        print("\n>>> Thank you for using our program")
        return "0"
    else:
        return "invalid"

def funcToPerform(choice):
    print('\n[1] Add ' + choice)
    print('[2] Delete ' + choice)
    print('[3] Search ' + choice)
    print('[4] Update ' + choice)
    
    option = input("\n>>> Enter your choice here: ")
    return option