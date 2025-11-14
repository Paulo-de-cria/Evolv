const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar storage para uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        
        // Criar diretório se não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, 'product-' + uniqueSuffix + fileExtension);
    }
});

// Filtrar tipos de arquivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas (JPEG, JPG, PNG, GIF, WEBP)'));
    }
};

// Configurar multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limite
    },
    fileFilter: fileFilter
});

// Middleware para upload único
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 'error',
                    message: err.message
                });
            }
            next();
        });
    };
};

// Middleware para múltiplos uploads
const uploadMultiple = (fieldName, maxCount = 5) => {
    return (req, res, next) => {
        upload.array(fieldName, maxCount)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    status: 'error',
                    message: err.message
                });
            }
            next();
        });
    };
};

// Função para deletar arquivo
const deleteFile = (filename) => {
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                // Se o arquivo não existe, não é considerado erro
                if (err.code === 'ENOENT') {
                    resolve(true);
                } else {
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    });
};

// Função para validar tamanho da imagem
const validateImageSize = (filePath, maxWidth = 1200, maxHeight = 1200) => {
    return new Promise((resolve) => {
        // Esta é uma implementação básica
        // Em produção, você pode usar uma biblioteca como 'sharp' para validação real
        resolve(true);
    });
};

// Gerar URL pública do arquivo
const getFileUrl = (filename) => {
    if (!filename) return null;
    
    // Em produção, isso seria a URL do seu CDN ou servidor de arquivos
    if (process.env.NODE_ENV === 'production') {
        return `${process.env.APP_URL}/uploads/${filename}`;
    }
    
    return `/uploads/${filename}`;
};

// Processar upload para Supabase Storage (futura implementação)
const uploadToSupabase = async (file) => {
    // Implementação futura para upload direto no Supabase Storage
    // Por enquanto, usamos sistema de arquivos local
    return {
        success: true,
        filename: file.filename,
        path: file.path,
        url: getFileUrl(file.filename)
    };
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    deleteFile,
    validateImageSize,
    getFileUrl,
    uploadToSupabase
};