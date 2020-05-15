import { ComponentType } from "preact";
export declare type Wrapper = (Component: ComponentType) => ComponentType;
export declare type Callback<P, R> = (props?: P) => R;
export declare type ResolverType = () => void;
