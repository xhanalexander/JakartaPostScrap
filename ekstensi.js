const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

let options = {
   // https://www.thejakartapost.com/culture/2022/10/27/six-young-ceos-talk-reaching-success-without-abandoning-ethical-leadership.html
   // https://www.thejakartapost.com/business/tech
   // https://www.thejakartapost.com/academia/insight
   // https://www.thejakartapost.com/business/companies
   url: 'https://www.thejakartapost.com/business/companies',

   headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
   }
}

request(options, (error, response, body) => {
   if (!error && response.statusCode == 200) {
      var news = cheerio.load(body)
      var title = news("title").text()

      /*
      // ==================== One Page ====================
      var $ = news('.row')
      var Headline = $.find('.title-large', 'h1').text()
      // var Location = $.find('.posting').text().split(' / ')[0].replace(/\s\s+/g, ' ').trim()
      var Date = $.find('.day', 'span').text()
      var Author = $.find('.detailArticleCreate', 'span').text().replace(/\s\s+/g, ' ').trim()
      var Category = $.find('.dt-academia', 'a').text().trim()
      var Category_2 = $.find('.menu-active-breadcrumbs', 'a').text().replace(/\s\s+/g, ' ').trim()
      var NewsHeadline = $.find('.detailNews', 'p').children('p').text()

      const NewsInfo = {
         Website_News: title,
         Headline_News: Headline,
         Author_News: Author,
         Date_News: Date,
         Category_News: Category_2,
         Article_News: NewsHeadline
      }

      if (Object.keys(NewsInfo).length != 0) {
         fs.writeFileSync('JakartaPos.json', JSON.stringify(NewsInfo), (err) => {
            console.log('File successfully Saved!');
         })
      } else {
         console.log('Failed! Something went wrong!')
      }

      console.log(">> Website title \t = " + title)
      console.log(">> Title News \t\t = " + Headline)
      console.log(">> Location News \t = " + Location)
      console.log(">> Author News \t\t = " + Author)
      console.log(">> Category News \t = " + Category_2)
      console.log(">> Date News \t\t = " + Date)
      console.log(">> News Content \t : \n\n" + NewsHeadline)
      */
     
     var arr = []

      news('.latestDetail').each(function (index) {

         // ==================== Each Page Card Latest ====================
         var Headline = news(this).find('a h2').text().replace(/\s\s+/g, '').trim()
         var Url = news(this).find("a").next().attr('href')
         var Description = news(this).find("p").text().replace(/\s\s+/g, ' ')
         var Date = news(this).children().next().next().next().text()
         var Thumbnail = news(this).parent().find('.imageLatest img').attr('data-src')
         var NewsContent = news(this)

         const NewsInfo = {
            Website_News: title,
            Headline_News: Headline,
            Description_News: Description,
            Url_News: "https://www.thejakartapost.com" + Url,
            Thumbnail_News: Thumbnail,
            Date_News: Date,
         }

         arr.push(JSON.stringify(NewsInfo))

      })

      fs.writeFileSync('JakartaPost.json', arr.toString(), (err) => {
         if (err) throw err;
         console.log("Successfully Saved!")
      })

   } else {
      console.log('Status = ', error)
   }
})
