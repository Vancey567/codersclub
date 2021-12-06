class UserDto {
    id;
    phone;
    name;
    avatar;
    activated;
    createdAt;

    constructor(user) {
        this.id = user._id;
        this.phone = user.phone;
        this.name = user.name;
        // this.avatar = user.avatar ? `${process.env.BASE_URL}${user.avatar}` : null; // If the avatar exist then append it with our base url so that we can directly assign it to the img src attribute.
        this.avatar = user.avatar; // Since we set the base url in the DB using getter function we don't need to give the path here now
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }
}

module.exports = UserDto; // we are not creating the object of class of reqest using new keyword.
