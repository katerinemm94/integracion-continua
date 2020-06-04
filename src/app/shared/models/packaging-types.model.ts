export class PackagingTypes {
    id: number;
    description: string;
}

export const PACKAGING_TYPES_OBJECT = {
    ARMADO: { id: 0, description: 'Armado' },
    DESARMADO: { id: 1, description: 'Desarmado' },
};


export const PACKAGING_TYPES: PackagingTypes[] = [
    { id: 0, description: 'Armado' },
    { id: 1, description: 'Desarmado' },
];
