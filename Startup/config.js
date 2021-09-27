const config =require('config')

module.exports=()=>{
  if (!config.get('DB_URL')) {
       throw new Error("you need to add env variable : DB_URL , SCRAPING_CRON")
    }
}