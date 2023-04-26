import ShoppingItem from '../models/ShoppingItem';

// LoginState is the state of the login page
export interface LoginState {
    isLogged: boolean;
    loading: boolean;
    token: string;
    error: string;
    username: string;
}

// ShoppingState is the state of the shopping list
export interface ShoppingState {
    list: ShoppingItem[];
    error: string;
}

// AppState is the state of the whole application
export interface AppState {
    login: LoginState;
    shopping: ShoppingState;
}