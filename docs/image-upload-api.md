# API de Subida de Imágenes - UserProfile

El controlador `UserProfileController` ahora soporta la subida de archivos de imagen junto con los datos del perfil en una sola petición.

## Endpoints que soportan subida de archivos

### 1. Crear Perfil Completo
```
POST /user-profiles
Content-Type: multipart/form-data
```

### 2. Actualizar Perfil por ID
```
PUT /user-profiles/:id
Content-Type: multipart/form-data
```

### 3. Actualizar Perfil por UserID
```
PUT /user-profiles/user/:userId
Content-Type: multipart/form-data
```

## Cómo enviar la petición

### Con cURL
```bash
curl -X POST http://localhost:3000/user-profiles \
  -F "userId=1" \
  -F "name=Juan" \
  -F "surname=Pérez" \
  -F "email=juan@example.com" \
  -F "birthYear=1990" \
  -F "gender=1" \
  -F "runningExperience=2" \
  -F "usuallyTravelRace=1" \
  -F "phoneCountryCode=+54" \
  -F "phoneNumber=1123456789" \
  -F "imageName=profile.jpg" \
  -F "imageFile=@/path/to/image.jpg"
```

### Con JavaScript/Fetch
```javascript
const formData = new FormData();
formData.append('userId', '1');
formData.append('name', 'Juan');
formData.append('surname', 'Pérez');
formData.append('email', 'juan@example.com');
formData.append('birthYear', '1990');
formData.append('gender', '1');
formData.append('runningExperience', '2');
formData.append('usuallyTravelRace', '1');
formData.append('phoneCountryCode', '+54');
formData.append('phoneNumber', '1123456789');
formData.append('imageName', 'profile.jpg');
formData.append('imageFile', fileInput.files[0]);

fetch('/user-profiles', {
  method: 'POST',
  body: formData
});
```

### Con Postman
1. Seleccionar método POST
2. URL: `http://localhost:3000/user-profiles`
3. En la pestaña "Body", seleccionar "form-data"
4. Agregar los campos como "Text":
   - userId: 1
   - name: Juan
   - surname: Pérez
   - email: juan@example.com
   - birthYear: 1990
   - gender: 1
   - runningExperience: 2
   - usuallyTravelRace: 1
   - phoneCountryCode: +54
   - phoneNumber: 1123456789
   - imageName: profile.jpg
5. Agregar el campo "imageFile" como "File" y seleccionar la imagen

## Comportamiento

### Subida de imagen
- El campo `imageFile` es opcional
- Si se envía `imageFile`, se guardará el buffer en la base de datos
- Si no se proporciona `imageName` pero sí `imageFile`, se usará el nombre original del archivo
- Si se proporciona `imageName`, se usará ese nombre independientemente del nombre del archivo

### Sin subida de imagen
- Los endpoints funcionan normalmente sin el archivo
- Se pueden enviar como `application/json` si no hay archivo
- Solo `imageName` e `imageFile` quedarán como `null`

### Actualización
- Si se envía una nueva imagen, reemplazará la anterior
- Si no se envía imagen, la existente se mantiene
- Se puede actualizar solo `imageName` sin cambiar `imageFile`

## Validaciones

### Campos requeridos (creación)
- userId, name, surname, email, birthYear, gender, runningExperience, usuallyTravelRace, phoneCountryCode, phoneNumber

### Campos opcionales
- imageName, imageFile, cars, preferredRaceTypes, preferredDistances

### Validaciones de imagen
- `imageName`: máximo 255 caracteres
- `imageFile`: cualquier tipo de archivo (se recomienda validar tipo en el frontend)

## Respuesta
La respuesta incluirá:
```json
{
  "id": 1,
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan@example.com",
  "birthYear": 1990,
  "gender": 1,
  "runningExperience": 2,
  "usuallyTravelRace": 1,
  "phoneCountryCode": "+54",
  "phoneNumber": "1123456789",
  "imageName": "profile.jpg",
  "imageFile": "Buffer(...)", // Datos binarios de la imagen
  "user": { ... },
  "cars": [...],
  "preferredRaceTypes": [...],
  "preferredDistances": [...],
  "createdAt": "2025-10-12T...",
  "updatedAt": "2025-10-12T..."
}
```

## Notas importantes
- El `imageFile` se devuelve como Buffer en la respuesta
- Para mostrar la imagen en el frontend, necesitarás convertir el Buffer a base64 o crear un endpoint separado para servir imágenes
- El tamaño máximo del archivo está limitado por la configuración de Multer (por defecto sin límite)