class UserDto {
    id;
    phone;
    activated;
    createdAt;

    constructor({user}) {
        this.id = user._id;
        this.phone = user.phone;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }
}

module.exports = UserDto; // we are not creating the object of class of reqest using new keyword.
