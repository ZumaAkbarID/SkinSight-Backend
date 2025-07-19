import axios from 'axios'
import env from '#start/env'

export async function getEducations(page: number = 1) {
  try {
    const apiRes = await axios.post(
      `${env.get('ML_URL')}/skincare-educations`,
      {
        page: Number(page),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    const mappedData = apiRes.data.Educations_List.map((item: any) => ({
      title: item.Title,
      link: item.Link,
      image: item.Image,
      snippet: item.Snippet,
      date: item.Date,
      category: item.Category,
    }))

    const hasNext = Number(apiRes.data.Pagination.Next_Page) > Number(page)

    return {
      status: true,
      message: 'Successfully getting educations',
      api: {
        educations: mappedData,
        hasNext: hasNext,
        currentNext: Number(page),
        nextPage: hasNext ? Number(page) + 1 : null,
      },
    }
  } catch (err: any) {
    console.error('Error saat menghubungi ML API:', err)

    const apiMessage = err.response?.data?.detail || 'Failed to call ML API'

    return {
      status: false,
      message: apiMessage,
      api: null,
    }
  }
}

export async function getEducationDetail(articleLink: string) {
  try {
    const apiRes = await axios.post(
      `${env.get('ML_URL')}/skincare-education-details`,
      {
        article_link: articleLink,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    if (!apiRes.data) {
      return {
        status: false,
        message: 'No data found for the provided article link',
        api: null,
      }
    }

    const mappedData = {
      title: apiRes.data.Title,
      author: apiRes.data.Author,
      date: apiRes.data.Date,
      coverImage: apiRes.data.Cover_Image,
      content: apiRes.data.Content,
      images: apiRes.data.Images || [],
    }

    return {
      status: true,
      message: 'Successfully getting detail education',
      api: mappedData,
    }
  } catch (err: any) {
    console.error('Error saat menghubungi ML API:', err)

    const apiMessage = err.response?.data?.detail || 'Failed to call ML API'

    return {
      status: false,
      message: apiMessage,
      api: null,
    }
  }
}
