export default interface IPlace {
    getAll(): Promise<any[]>;
    getMediaById(id: string): Promise<any[]>;
}