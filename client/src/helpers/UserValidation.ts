import type { UserCreateDto } from "../models/users/UserCreateDto";

export function validateUserCreate(data: UserCreateDto): string[] {
    const errors: string[] = [];

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
        errors.push("Enter valid email adress.");
    }

    if (!data.password || data.password.length < 8) {
        errors.push("Password must have at least 8 characters.");
    }

    if (!data.firstName?.trim()) errors.push("Name is required.");
    if (!data.lastName?.trim()) errors.push("Last name is required.");

    if (!data.dateOfBirth) {
        errors.push("Date of birth is required.");
    } else {
        const dob = new Date(data.dateOfBirth);
        if (dob >= new Date()) {
            errors.push("You cannot choose date of birth in future.");
        }
    }

    if (data.accountBalance < 0) {
        errors.push("Account balance cannot be negative number.");
    }

    return errors;
}