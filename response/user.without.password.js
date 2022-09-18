class UserWithOutPassword {
    constructor(user) {
        this.fullName = user.fullName;
        this.email = user.email;
        this.mobile = user.mobile;
        this.createdAt = user.createdAt;
    }

    fullName;
    email;
    mobile;
    createdAt;
}

export default UserWithOutPassword;