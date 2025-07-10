import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationDetailsController {
  async handle({ request, response }: HttpContext) {
    const educationId = request.param('id')

    if (!educationId) {
      return response.status(400).send(errorResponse('Education ID is required', 400))
    }

    const educationMap: Record<string, { title: string; category: string; markdown: string }> = {
      'uuid-1': {
        title: 'Perawatan Kulit Berjerawat',
        category: 'Acne',
        markdown: `
# Perawatan Kulit Berjerawat

Jerawat muncul akibat pori-pori tersumbat. Berikut beberapa tips:

1. Gunakan pembersih dengan **salicylic acid**
2. Hindari menyentuh wajah secara berlebihan
3. Pakai pelembab non-comedogenic
4. Gunakan obat totol jerawat saat dibutuhkan

![Jerawat](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800)
        `.trim(),
      },

      'uuid-2': {
        title: 'Cara Memilih Sunscreen yang Tepat',
        category: 'Sunscreen',
        markdown: `
# Cara Memilih Sunscreen

Sunscreen sangat penting untuk mencegah penuaan dini dan kanker kulit.

- Pilih SPF minimal **30**
- Gunakan yang bertuliskan **"broad spectrum"**
- Reapply setiap 2 jam jika terpapar matahari langsung

![Sunscreen](https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800)
        `.trim(),
      },

      'uuid-3': {
        title: 'Mengenal Ingredients Berbahaya',
        category: 'Ingredients',
        markdown: `
# Mengenal Ingredients Berbahaya

Beberapa bahan perlu dihindari:

- **Paraben**: bisa mengganggu hormon
- **SLS (Sodium Lauryl Sulfate)**: dapat mengiritasi kulit
- **Alcohol Denat.**: bikin kulit kering

> Selalu baca label sebelum membeli produk skincare.
        `.trim(),
      },

      'uuid-4': {
        title: 'Langkah Dasar Skincare untuk Pemula',
        category: 'Skincare Dasar',
        markdown: `
# Langkah Dasar Skincare

Untuk pemula, cukup lakukan 3 langkah berikut:

1. **Cleanser**: untuk membersihkan wajah
2. **Moisturizer**: untuk melembapkan kulit
3. **Sunscreen**: untuk perlindungan dari sinar UV

✨ Mulai dari yang sederhana, konsisten adalah kunci!
        `.trim(),
      },

      'uuid-5': {
        title: 'Perbedaan Toner dan Essence',
        category: 'Produk Skincare',
        markdown: `
# Perbedaan Toner dan Essence

| Toner              | Essence                 |
|--------------------|--------------------------|
| Mengangkat sisa kotoran | Memberi hidrasi dan nutrisi |
| Dipakai setelah cuci muka | Dipakai sebelum serum     |

💡 Gunakan sesuai kebutuhan kulitmu!
        `.trim(),
      },
    }

    const educationDetail = educationMap[educationId]

    if (!educationDetail) {
      return response.status(404).send(errorResponse('Education not found', 404))
    }

    return response.status(200).send(
      successResponse(
        {
          id: educationId,
          ...educationDetail,
        },
        'Education detail fetched successfully',
        200
      )
    )
  }
}
