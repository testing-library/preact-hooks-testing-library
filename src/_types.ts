import { ComponentType } from "preact";

export type Callback<P, R> = (props?: P) => R;

export type ResolverType = () => void;
