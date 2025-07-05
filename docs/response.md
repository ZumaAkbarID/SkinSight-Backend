# Daftar HTTP Status Code untuk API

| Kode | Nama                  | Deskripsi Singkat                                       |
| ---- | --------------------- | ------------------------------------------------------- |
| 200  | OK                    | Permintaan berhasil (sukses, default response).         |
| 201  | Created               | Data berhasil dibuat (biasanya POST/CREATE).            |
| 202  | Accepted              | Permintaan diterima untuk diproses, tapi belum selesai. |
| 204  | No Content            | Berhasil, tapi tidak ada konten dikembalikan.           |
| 400  | Bad Request           | Permintaan tidak valid (validation error).              |
| 401  | Unauthorized          | Autentikasi gagal atau tidak ada token.                 |
| 403  | Forbidden             | Tidak diizinkan mengakses resource.                     |
| 404  | Not Found             | Resource/data tidak ditemukan.                          |
| 409  | Conflict              | Konflik data (misal, data sudah ada).                   |
| 422  | Unprocessable Entity  | Validasi gagal/format tidak bisa diproses.              |
| 429  | Too Many Requests     | Terlalu banyak permintaan (rate limit).                 |
| 500  | Internal Server Error | Kesalahan server.                                       |
| 502  | Bad Gateway           | Server mendapatkan response buruk dari upstream.        |
| 503  | Service Unavailable   | Layanan sedang tidak tersedia.                          |
| 504  | Gateway Timeout       | Timeout pada gateway/server upstream.                   |
