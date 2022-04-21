const vue = new Vue({
  el:'#app',
  data:{
    repositories : [],
    filterBy: 'challenge',
    idSheets: '1YSGreI32MRiFxdMOahJ25TV-jZlUGcUsxSoJZubWcu8',
    apiKey: 'AIzaSyAAPKL_m1UKJlliH9_jmLiO2tsTGRiiIsU',
    range: {
      from: 0,
      to: 0
    },
    loadMore: true
  },
  mounted(){
   this.getRepositories();
   window.addEventListener("scroll", this.handleScroll);
  },
  computed: {
    repositoriesFiltered(){
      return this.repositories.filter(repository => repository[6] === this.filterBy);
    },
    showEndResults(){
      return !this.loadMore && this.repositoriesFiltered.length > 0;
    },
    showEmptyResults(){
      return this.repositoriesFiltered.length < 1;
    }
  },
  methods:{
    refresh(){
      this.getRepositories()
    },
    filterByType(type){
      this.filterBy = type
    },
    getRepositories(){
      if(this.loadMore){
        this.range.from = this.range.to + 1;
        this.range.to += 9;

        let values = `A${this.range.from}:AZ${this.range.to}`

        fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${this.idSheets}/values/${values}?access_token=${this.apiKey}&key=${this.apiKey}`)
        .then((repositories)=>{
          return repositories.json()
        })
        .then((repositories)=>{
          if(repositories.values){
            this.repositories = this.repositories.concat(repositories.values);
          }else{
            this.loadMore = false
          }
        })
        .catch(err=>{
          console.log(err);
        })
      }
    },
    handleScroll() {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50){
        this.getRepositories();
      }
    }
  }
 })