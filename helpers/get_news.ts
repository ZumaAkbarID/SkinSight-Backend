import axios from 'axios'
import env from '#start/env'

export async function getNews(page: number = 1) {
  try {
    const apiRes = await axios.post(
      `${env.get('ML_URL')}/skincare-news`,
      {
        page,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    const mappedData = apiRes.data.article_list.map((item: any) => ({
      title: item.Title,
      link: item.Link,
      image: item.Image,
      date: item.Date,
      category: item.Category,
    }))

    const hasNext =
      Number(apiRes.data['Page Numbers'][apiRes.data['Page Numbers'].length - 1]) > Number(page)

    return {
      status: true,
      message: 'Successfully getting recommendations',
      api: {
        news: mappedData,
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

export async function getNewsDetail(articleLink: string) {
  try {
    const apiRes = await axios.post(
      `${env.get('ML_URL')}/skincare-news-details`,
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

    if (!apiRes.data || !apiRes.data.length) {
      return {
        status: false,
        message: 'No data found for the provided article link',
        api: null,
      }
    }

    const mappedData = {
      title: apiRes.data[0].Title,
      imageUrl: apiRes.data[0].ImageUrl,
      date: apiRes.data[0].Date,
      source: apiRes.data[0].Source,
      author: apiRes.data[0].Author,
      content: apiRes.data[0].Content,
    }

    return {
      status: true,
      message: 'Successfully getting recommendations',
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
