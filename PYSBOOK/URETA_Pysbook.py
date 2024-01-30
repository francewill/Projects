"""
France William L. Ureta
December 27, 2021 12:57 PM

This is a terminal-based python program that looks like facebook. A user can create their own
account, update their password, update their bio, view their profile, add friend, send a
friend request, accept a friend request, delete a friend request, unfriend, view all friends,
view friend's profile, delete all friends, and save and load the database. 
"""
import hashlib 

user = {}

def encryptPassword(inputPassword):  # Function for encryption
    password = hashlib.md5(inputPassword.encode()).hexdigest()
    return password

def save():  # Function for saving the file
    file = open("user.csv", "w")  # Opening file for writing
    for key in user.keys():
        password = user[key]["Password"]
        name = user[key]["Name"]
        age = user[key]["Age"]
        bio = user[key]["Bio"]
        file.write(key + "," + password + "," + name + "," + str(age) + "," + bio)
        if len(user[key]["Friendlist"]) != 0:  # With friends
            file.write(",")
        for friends in user[key]["Friendlist"]:  # Add "+" for each friends
            file.write("+" + friends)
        if len(user[key]["Pending"]) != 0:  # With friend request
            file.write(",")
        for pending in user[key]["Pending"]:  # Add "-" for each request
            file.write("-" + pending)
        file.write("\n")
    file.close()

def load():  # Function for loading the file
    file = open("user.csv", "r")  # Opening file for reading
    for line in file:
        userInfo = line[0:-1].split(",")
        emailAdd = userInfo[0]
        password = userInfo[1]
        name = userInfo[2]
        age = userInfo[3]
        bio = userInfo[4]
        info = {}
        info["Password"] = password
        info["Name"] = name
        info["Age"] = age
        info["Bio"] = bio
        info["Friendlist"] = []
        info["Pending"] = []
        if len(userInfo) > 5:  # With Pending but No Friends vice versa 
            if "+" in userInfo[5]:  # Check if with Friends
                friendlist = userInfo[5].split("+")
                for friend in friendlist[1:]:
                    info["Friendlist"].append(friend)
            else:  # Check if with pending
                pendinglist = userInfo[5].split("-")
                for pend in pendinglist[1:]:
                    info["Pending"].append(pend)
        if len(userInfo) > 6:  # With Friends and Pending
            pendinglist = userInfo[6].split("-")
            for pend in pendinglist[1:]:
                info["Pending"].append(pend)
        user[emailAdd] = info
    file.close()

def addUser():  # Function for creating an account
    print("\n>>> Sign Up")
    emailAdd = input("Email Address: ")
    if emailAdd in user.keys():  # Check if the Email Address already exist
        print("\n",emailAdd, "already exists please try again")
    else:
        inputPassword = input("Password: ")
        password = encryptPassword(inputPassword)
        name = input("Name: ")
        while True:
            try:  # Catch error if the user inputs a non-integer
                age = int(input("Age: "))
                break
            except ValueError:
                print("\n>>> Please enter a valid age")
        bio = input("Bio: ")
        info = {}  # Add another dictionary to store additional information
        info["Password"] = password
        info["Name"] = name
        info["Age"] = age
        info["Bio"] = bio
        info["Friendlist"] = []  # List for your friends
        info["Pending"] = []  # List for Friend Requests
        user[emailAdd] = info
        print("\n=== Account successfully created! ===")
    save()

def updatePassword(emailUser):  # Function for creating a new password
    confirmation = input("\n>>> Enter your current password: ")
    hashedConfirmation = encryptPassword(confirmation)
    if hashedConfirmation == emailUser["Password"]:  # Checks the password of the current user
        newPassword = input(">>> Enter your new password: ")
        hashedNewPassword = encryptPassword(newPassword)
        emailUser["Password"] = hashedNewPassword
        print("\n=== Your password is successfully updated! ===")
    else:
        print("\nWrong password! Please try again.")
    save()

def updateBio(emailUser):  # Function for updating a new bio
    newBio = input("\n>>> Enter your new Bio: ")
    emailUser["Bio"] = newBio
    print("\n=== Your Bio is successfully updated! ===")
    save()

def viewOwnProfile(emailUser):  # This function is used to view your own profile
    print(">>> Name:", emailUser["Name"])
    print(">>> Age:", emailUser["Age"])
    print(">>> Bio:", emailUser["Bio"])

def addFriend(currentUser):  # Function to add a user/friend
    addFriendUser = input("\n>>> Enter user's email that you want to add: ")
    if addFriendUser == currentUser:
        print("\n>>> You can't add yourself!!")
    else:
        if addFriendUser in user.keys():  # Checks if the user exist 
            if addFriendUser not in user[currentUser]["Friendlist"]:  # Checks if you are already friends or not
                if currentUser in user[addFriendUser]["Pending"]:  # Check if the user already sent a friend request
                    print("\n>>> You've already sent a friend request to",user[addFriendUser]["Name"])
                else:
                    if addFriendUser not in user[currentUser]["Pending"]:  # Sending friend request
                        user[addFriendUser]["Pending"].append(currentUser)
                        print("\n>>> You sent a friend request to", user[addFriendUser]["Name"])
                    else:  # Accepting friend request
                        user[currentUser]["Friendlist"].append(addFriendUser)  # Both users should be mutual
                        user[addFriendUser]["Friendlist"].append(currentUser)
                        user[currentUser]["Pending"].remove(addFriendUser)
                        print("\n>>> You are now friends with", user[addFriendUser]["Name"])
            else:
                print("\n>>> You are already friends with", user[addFriendUser]["Name"])
        else:
            print("\n>>> User does not exist!!")
    save()

def unfriendUser(currentUser2):  # This function is used to unfriend a user
    unFriend_User = input("\n>>> Enter user's email that you want to unfriend: ")
    if unFriend_User == currentUser2: 
        print("\n>>> You can't unfriend yourself!!")
    else:
        if unFriend_User in user.keys():
            if unFriend_User in user[currentUser2]["Friendlist"]:
                user[currentUser2]["Friendlist"].remove(unFriend_User)  # Unfriend should also be mutual for both users
                user[unFriend_User]["Friendlist"].remove(currentUser2)
                print("\n>>> Successfully unfriended", user[unFriend_User]["Name"])
            else:
                print("\n>>> This user is already not in your friends list")
        else:
            print("\n>>> User does not exist!!")
    save()

def viewAllFriends(currentUser3):  # This function is used to view all friends
    if len(user[currentUser3]["Friendlist"]) == 0:
        print("\n=== Your friends list are empty please add a user first ===")
    else:
        print("\n=== Here is your Friends list! ===")
        for friends in user[currentUser3]["Friendlist"]:
            print(">>>",user[friends]["Name"])

def viewFriendProfile(currentUser4):  # Function for view profile of user's friend
    if len(user[currentUser4]["Friendlist"]) == 0:
        print("\n=== Your friends list are empty please add a user first ===")
    else:
        viewFriend = input("\n>>> Enter your friend's email: ")
        if viewFriend == currentUser4:
            choice = input("\n>>> Do you want to view your own profile?\n[1] YES\n[2] NO\nChoice: ")
            if choice == "1":
                print("\n=== " + user[currentUser4]["Name"] + "'s" " Profile ===")
                print("\n>>> Email Address:", currentUser4)
                viewOwnProfile(user[currentUser4])
            elif choice == "2":
                viewFriendProfile(currentUser4)
            else:
                print("\n>>> Wrong input!!") 
        else:    
            if viewFriend in user.keys():
                if viewFriend in user[currentUser4]["Friendlist"]:
                    print("\n=== " + user[viewFriend]["Name"] + "'s" " profile ===")
                    print("\n>>> Email Address:", viewFriend)
                    viewOwnProfile(user[viewFriend])  # Calls the function view profile for convenience 
                else:
                    print("\n>>> You are not friends with", user[viewFriend]["Name"])
            else:
                print("\n>>> User does not exist!!")

def deleteAllFriends(currentUser5):  # Function for deleting all friends
    choice = input("\n>>> Are you sure you want to delete all of your friends?\n>>> [1] Yes\n>>> [2] No\nChoice: ")
    if choice == "1":
        confirmation = input("\n>>> Please enter your password to proceed: ")  # Enter password to proceed
        hashedConfirmation = encryptPassword(confirmation)
        if hashedConfirmation == user[currentUser5]["Password"]:
            for eachFriend in user.keys():
                if eachFriend not in user[currentUser5]["Friendlist"]:
                    continue
                else:
                    user[currentUser5]["Friendlist"].remove(eachFriend)  # Removing friends are also mutual for both users
                    user[eachFriend]["Friendlist"].remove(currentUser5)
            print("\n=== ALL FRIENDS ARE DELETED ===")
        else:
            print("\n>>> Wrong password!!")
        
    elif choice == "2":
        print("Deleting All Friends Failed")
    else:
        print("\n>>> Wrong input!!")
    save()
    
def checkFriendReq(currentUser6):  # Function for friend requests
    if len(user[currentUser6]["Pending"]) == 0:
        print("\n>>> There are no friend request!")
    else:
        print("\n=== Here is the list of Friend Request! ===")
        for friendReqs in user[currentUser6]["Pending"]:
            print(">>> Email Address:",friendReqs,"| Name:",user[friendReqs]["Name"])
        choice = input("\n>>> [1] Add friend request\n>>> [2] Delete friend request\n>>> [3] Go back to menu \nChoice: ")
        if choice == "1":  # Condition for adding friend request
            addFriend(currentUser6)
        elif choice == "2":  # Condition for deleting friend request
            deleteFriendReq = input("\n>>> Enter user's email that you want to delete request: ")
            if deleteFriendReq == currentUser6:
                print("\n>>> You can't enter your own email!!")
            else:
                if deleteFriendReq in user.keys():
                    user[currentUser6]["Pending"].remove(deleteFriendReq)  # Removes friend request
                    print("\n>>> Successfully deleted", user[deleteFriendReq]["Name"]+"'s friend request")
                else:
                    print("\n>>> User does not exist!!")
        elif choice == "3":  # Condition for going back to menu
            print("")
        else:
            print("\n>>> Wrong input!!")
        save()

def LogIn():  # This function is used so that users can log in
    if len(user) == 0:
        print("\n>>> No account exist")
    else:
        print("\n>>> LOG IN")
        loginEmail = input("Email Address: ")
        info = user[loginEmail]
        if loginEmail in user.keys():
            while True:  # Repeatedly asks for password if the user entered a wrong password
                loginPassword = input("Password: ")
                hashedLoginPass = encryptPassword(loginPassword)
                if hashedLoginPass == info["Password"]:
                    break
                else:
                    print("\nWrong password\n")
            print("\n>>> Welcome", info["Name"] + "!! <<<")
            while True:  # Repeatedly prints the second menu
                c = menu2()
                if c == "1":  # Conditions for the second menu
                    updatePassword(info)
                elif c == "2":
                    updateBio(info)
                elif c == "3":
                    print("\n=== " + info["Name"] + "'s" " Profile ===")
                    print("\n>>> Email Address:", loginEmail)
                    viewOwnProfile(info)
                elif c == "4":
                    addFriend(loginEmail)
                elif c == "5":
                    unfriendUser(loginEmail)
                elif c == "6":
                    viewAllFriends(loginEmail)
                elif c == "7":
                    viewFriendProfile(loginEmail)
                elif c == "8":
                    deleteAllFriends(loginEmail)
                elif c == "9":
                    checkFriendReq(loginEmail)
                elif c == "10":
                    print(
                        "\n>>> You've Been Logged Out\n>>> Have a nice day",
                        info["Name"] + "!!",
                    )
                    break
                else:
                    print("Invalid input!")
        else:
            print("User not found")

def menu():  # Function for menu
    load()
    print("\n█▀█ █▄█ █▀ █▄▄ █▀█ █▀█ █▄▀")
    print("█▀▀ ░█░ ▄█ █▄█ █▄█ █▄█ █░█")
    print("\n>>> [1] Create New Account")
    print(">>> [2] Log In")
    print(">>> [0] Exit")
    choice = input("Choice: ")
    return choice

def menu2():  # Function for second menu
    print("\n>>> [1] Update Password")
    print(">>> [2] Update Bio")
    print(">>> [3] View Own Profile")
    print(">>> [4] Add Friend")
    print(">>> [5] Unfriend")
    print(">>> [6] View All Friends")
    print(">>> [7] View Friend's Profile")
    print(">>> [8] Delete All Friends")
    print(">>> [9] Check Friend Request")
    print(">>> [10] Log Out")
    choice = input("\nChoice: ")
    return choice

while True:  # Repeatedly prints the first menu until exit.
    c = menu()
    if c == "1":  # Conditions for accessing the functions
        addUser()
    elif c == "2":
        try:
            LogIn()
        except KeyError:
            print("\nSorry account does not exist.\nPlease create an account first.")
    elif c == "0":
        print("\nThank you for using this program!")
        break
    else:
        print("\nInvalid input!")

