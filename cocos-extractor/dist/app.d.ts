export interface IInput {
    uri: string;
    output: string;
    versions: {
        config: string;
        index: string;
    };
}
export declare function start(input: IInput): Promise<void>;
