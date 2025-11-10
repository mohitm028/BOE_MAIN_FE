import { User } from '@/types/User';
import { createContext, ReactNode, useEffect, useState } from 'react';

type UserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        id: '',
        username: '',
        email: '',
        role: '',
    });

    const dummyData = {
        admin: {
            id: '3',
            username: 'John CA7',
            email: 'john.doe@example .com',
            role: 'CA7ADMIN',
        },
        manager: {
            id: '2',
            username: 'Jane Manager',
            email: 'abc@gmail.com',
            role: 'MANAGER',
        },
        user: {
            id: '1',
            username: 'Alice User',
            email: 'dkg@gmail.com',
            role: 'USER',
        },
    };
    //Set the Dummy User Data
    useEffect(() => {
        // setUser(dummyData.admin); // Default to admin for now
        // setUser(dummyData.manager); // Default to manager for now
        setUser(dummyData.user); // Default to user for now
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
