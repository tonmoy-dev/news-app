import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const users = [
    { email: 'admin@mail.com', password: 123456, role: 'admin' },
    { email: 'user@mail.com', password: 123456, role: 'user' },
    { email: 'editor@mail.com', password: 123456, role: 'editor' },
    { email: 'reporter@mail.com', password: 123456, role: 'reporter' },
];

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            role: null, // admin or user roles
            error: null, // for storing login errors

            // Function to set user and authenticate
            setUser: (userData) => set({ user: userData, isAuthenticated: true, role: userData.role }),

            // Function to clear the user state
            clearUser: () => set({ user: null, isAuthenticated: false, role: null, error: null }),

            // Verify user credentials (email & password) and log in
            verifyUser: (email, password) => {
                const foundUser = users.find((u) => u.email === email && u.password === password);
                if (foundUser) {
                    set({
                        user: { email: foundUser.email, role: foundUser.role },
                        isAuthenticated: true,
                        error: null,
                    });
                } else {
                    set({ error: 'Invalid email or password', isAuthenticated: false });
                }
            },
        }),
        {
            name: 'auth-store', // Key for localStorage
            getStorage: () => localStorage, // You can change this to sessionStorage if preferred
        }
    )
);

export default useAuthStore;