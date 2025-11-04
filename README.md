## Aplikasi Presensi Online 
Aplikasi ini adalah RESTful API untuk sistem Presensi Online siswa yang dibuat menggunakan Node.js dan Express sebagai tugas UKL XI RPL. Data siswa dan presensi disimpan di dalam array (belum menggunakan database). Fitur utama meliputi login autentikasi menggunakan JWT, enkripsi password dengan bcrypt.js, tambah/edit data siswa, mencatat presensi, melihat riwayat kehadiran, dan analisis presensi per siswa maupun per kelas.

## Teknologi yang Digunakan
| Teknologi      | Fungsi                             |
|----------------|------------------------------------|
| Node.js        | Runtime JavaScript                 |
| Express.js     | Framework untuk REST API           |
| JSON Web Token | Autentikasi berbasis token (JWT)  |
| bcryptjs       | Enkripsi password                  |
| body-parser    | Parsing JSON dari request          |

## Cara menjalankan aplikasi 
1. Masuk ke folder project
cd "C:\Backend XI\LatihanUKL1_Agnes"

2. Install package
npm install express jsonwebtoken bcryptjs body-parser

3. Jalankan server
node server.js lalu akan tampil http://localhost:3000 jika berhasil

## 1. a. Autentifikasi dan otorisasi login
   <img width="1920" height="1020" alt="login" src="https://github.com/user-attachments/assets/13ce49f5-638d-4f62-bf94-0c4af6e8bd99" />
   disini admin maupun siswa bisa mendapatkan token untuk mengakses endpoint yang berbeda-beda sesuai dengan hak akses.
   
## 2. a. Pengelolaan data pengguna (menmabah pengguna)
   <img width="1920" height="1020" alt="Tambah Siswa" src="https://github.com/user-attachments/assets/5b851bc2-6588-4e21-b5c3-8d7b8e6ab1fd" />
   menambah profil pengguna agar pengguna bisa mengakses berbagai macam endpoint yang berbeda. ini hanya bisa diakses oleh admin saja
   
   # b. Pengelolaan data pengguna (mengubah pengguna)
   <img width="1920" height="1020" alt="Update Siswa" src="https://github.com/user-attachments/assets/891c1348-145b-4a5c-b831-fe0d8db40eba" />
   digunakan untuk mengubah data pengguna menggunakan method put
   
   # c. Mengambil data pengguna
   <img width="960" height="1020" alt="Mengambil Data" src="https://github.com/user-attachments/assets/ec74a95c-baea-4731-bc71-2a7576aeae80" />
   digunakan untuk mengambil data pengguna dengan method get
   
## 3. a. Pencatatan presensi
   <img width="960" height="1020" alt="Catat Presensi" src="https://github.com/user-attachments/assets/adf5c637-8a96-46ae-bf84-f34b70966d5d" />
   mencatat presensi setiap siswa dengan method post
   
   # b. Riwayat presensi
   <img width="1920" height="1020" alt="Riwayat Presensi" src="https://github.com/user-attachments/assets/5163a0d1-cfe3-4bde-a8c6-2cad3a4c3d88" />
   untuk menampilkan riwayat presensi siswa dengan menggunakan method get
   
## 4. Analisis Kehadiran
   <img width="1920" height="1020" alt="Analisis Kehadiran" src="https://github.com/user-attachments/assets/b4361268-8a23-4202-a04b-473c3e60083e" />
   melihat rekap kehadiran bulanan menggunakan method get
