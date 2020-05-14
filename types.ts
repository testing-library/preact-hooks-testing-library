import { ComponentType } from "preact";

export type Wrapper = (Component: ComponentType) => ComponentType;

export type Callback<P, R> = (props?: P) => R;
