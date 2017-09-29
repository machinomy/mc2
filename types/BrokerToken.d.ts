export declare namespace BrokerToken {
    interface Contract {
        address: string;
        createChannel(address: string, receiver: string, duration: number, settlementPeriod: number, value: number, options: any): any;
        startSettle(channelId: string, payment: String, options: any): any;
        claim(address: string, channelId: string, value: number, h: string, v: number, r: string, s: string, options: any): any;
        finishSettle(address: string, channelId: string, options: any): any;
        deposit(address: string, channelId: string, value: number, options: any): any;
        canClaim(channelId: string, h: string, v: number, r: string, s: string): any;
        canStartSettle(account: string, channelId: string): any;
        canFinishSettle(sender: string, channelId: string): any;
        canDeposit(sender: string, channelId: string): any;
        getState(channelId: string): any;
        getUntil(channelId: string, callback: (error: any | null, until?: number) => void): void;
    }
}
