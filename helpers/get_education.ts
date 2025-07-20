import axios from 'axios'
import env from '#start/env'

export async function getEducations(
  page: number = 1,
  prev_link?: string | null,
  current_link?: string
) {
  try {
    let payload: {
      page: number
      prev_link?: string | null
      link?: string
    }

    if (page == 1) {
      payload = {
        page: Number(page),
      }
    } else if (page > 1 && prev_link && current_link) {
      payload = {
        page: Number(page),
        prev_link: prev_link,
        link: current_link,
      }
    } else {
      payload = {
        page: 1,
      }
    }

    const apiRes = await axios.post(`${env.get('ML_URL')}/skincare-educations`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    const mappedData = apiRes.data.Educations_List.map((item: any) => ({
      title: item.Title,
      link: item.Link,
      image: item.Image,
      snippet: item.Snippet,
      date: item.Date,
      category: item.Category,
    }))

    const hasNext = Number(apiRes.data.Pagination.Next_Page) > Number(page)

    let prevLink: string | null = null
    if (Number(page) == 1) {
      prevLink = apiRes.data.Pagination.Current_Link || null
    } else {
      prevLink = apiRes.data.Pagination.Prev_Link || null
    }

    return {
      status: true,
      message: 'Successfully getting educations',
      api: {
        educations: mappedData,
        hasNext: hasNext,
        // currentPage: Number(page),
        // currentLink: apiRes.data.Pagination.Current_Link || null,
        // prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        prevLink: prevLink,
        nextPage: hasNext ? Number(page) + 1 : null,
        nextLink: hasNext ? apiRes.data.Pagination.Next_Link : null,
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
