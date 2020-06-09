export const GENERAL = {
    ABREVIATURA_NOMBRE_APLICACION: 'TM',
    NOMBRE_APLICACION: 'Taller Motos',
    VERSION: '1.0.0',
    TOKEN_HEADER_KEY: 'authorization',
    TOKEN_KEY: 'AuthToken',
    REFRESH_TOKEN_KEY: 'RefreshToken',
    USERNAME_INFO: 'AuthUserInfo',
    AUTHORITIES_KEY: 'AuthAuthorities',
    ROUTES_KEY: 'AuthRoutes',
    CONFIG_KEY: 'Configurations',
    ROLES: {
        ADMIN: 'ROLE_ADMIN',
        SELLER: 'ROLE_SELLER',
        USER: 'ROLE_USER'
    },
    TIME_ALERT_INACTIVITY: 5,
    TIME_INACTIVITY: 60,
    NEW: 'NEW',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    IMAGES_DEFAULT: {
        PRODUCTS: 'assets/img/products_1.png',
        PROVIDERS: 'assets/img/providers_1.png'
    }
};

export const TIPOS_DOCUMENTO = {
    RC: 'RC',
    TI: 'TI'
};


export const SPANISH_DATATABLES = {
    processing: 'Procesando...',
    search: 'Buscar:',
    lengthMenu: 'Mostrar _MENU_ elementos',
    info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
    infoEmpty: 'Mostrando ningún elemento.',
    infoFiltered: '(filtrado _MAX_ elementos total)',
    infoPostFix: '',
    loadingRecords: 'Cargando registros...',
    zeroRecords: 'No se encontraron registros',
    emptyTable: 'No hay datos disponibles en la tabla',
    paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último'
    },
    aria: {
        sortAscending: ': Activar para ordenar la tabla en orden ascendente',
        sortDescending: ': Activar para ordenar la tabla en orden descendente'
    },
    buttons: {
        copyTitle: 'Datos copiados',
        copyKeys: 'Utilice el teclado o el menú para seleccionar el comando de copia',
        copySuccess: {
            1: 'Copiada una fila en el portapapeles',
            _: 'Copiadas %d filas en el portapapeles'
        },
    }
};

export const TEXTO_CROPPER = {
    default: 'De clic para seleccionar o arrastrar y soltar la imagen',
    button: 'Seleccionar imagen',
    reset: 'Borrar',
    _default: 'De clic para seleccionar o arrastrar y soltar la imagen',
    try_again: 'Inténtelo de nuevo',
    replace: 'De clic para seleccionar o arrastrar y soltar la imagen',
    error: 'Oops, algo malo pasó'
};

export const ERRORES_CROPPER = {
    fileSize: 'El tamaño del archivo es demasiado grande ({{ value }} máx).',
    minWidth: 'El ancho de la imagen es demasiado pequeño ({{ value }}}px mín).',
    maxWidth: 'El ancho de la imagen es demasiado grande ({{ value }}}px máx).',
    minHeight: 'La altura de la imagen es demasiado pequeña ({{ value }}}px mín).',
    maxHeight: 'La altura de la imagen es demasiado grande ({{ value }}}px máx).',
    imageFormat: 'El formato de imagen no está permitido (permitidos: {{ value }}).',
    fileType: 'El tipo de archivo no está permitido.'
};

export const OPCIONES_CROPPER_GENERAL = {
    fileType: ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'],
    fileSize: 4000,
    quality: 0.8,
    crop: [
        { ratio: 1, height: 512 },
    ]
};

export const OPCIONES_CROPPER_PRODUCTO = {
    fileType: ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'],
    fileSize: 4000,
    quality: 0.8,
    crop: [
        { ratio: 1, height: 512 }
    ]
};

export const OPCIONES_CROPPER_PROVEEDOR = {
    fileType: ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'],
    fileSize: 4000,
    quality: 0.8,
    crop: [
        { ratio: 1, height: 512 }
    ]
};
