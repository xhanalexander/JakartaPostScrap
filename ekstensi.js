const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

let baseUrl = "https://www.thejakartapost.com"

const getContentHtml = (path) => {
   return new Promise((resolve, reject) => {
      request({
         url: `${baseUrl}/${path}`,
         headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
         }
      }, (error, response, body) => {
         if (error != null) {
            reject(error)
         }
         resolve(body)
      })
   })
}

const execution = async () => {
   let NewscardArr = []
   let newsContentArr = []

   try {
      let body = await getContentHtml('/life/science-tech')
      let news = cheerio.load(body)
      let title = news('title').text()

      news('.listNews', '.columns').map(function (idx, el) {
         const cardObj = {
            title: news(this).find('.titleNews').text().trim(),
            url: news(this).find('.latestDetail').children()[1].attributes[0]['value'],   // dont change this
            Thumbnail: news(this).parent().find('.imageLatest img').attr('data-src'),
            Description: news(this).find("p").text().replace(/\s\s+/g, ' '),
         }
         // console.log(cardObj)
         NewscardArr.push(cardObj)
      })

      for (let card of NewscardArr) {
         let content = await getContentHtml(card.url)
         let newsContent = cheerio.load(content)
         let paragraphContent = ""

         newsContent('.detailNews').find('p').each((i, el) => {
            el.children.forEach((val) => {
               paragraphContent += val.data
            })
         })

         let Headline = newsContent('.title-large').text()
         let AuthorNews = newsContent('.writerName').text().trim()
         let Category = newsContent('.menu-active-breadcrumbs').text().trim()
         let DateNews = newsContent('.day')[0].children[0].data
         let Image = newsContent('.main-single img').attr('src') 

         // let ps = newsContent('.main-single img').attr('src')
         // console.log(ps)

         const newsObject = {
            Website_News: title,
            Headline_News: Headline,
            Author_News: AuthorNews,
            Category_News: Category,
            Image_News: Image,
            Date_News: DateNews,
            Article_News: paragraphContent.replace(/\s\s+/g, ' ')
         }
         newsContentArr.push(newsObject)
         // break
      }
      fs.writeFileSync('JakartaPost.json', JSON.stringify(newsContentArr), (err) => {
         if (err) throw err
         console.log("Successfully Saved!")
      })
   } catch (err) {
      console.log(err)
   }
}

execution()
