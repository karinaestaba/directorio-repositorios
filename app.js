const vue = new Vue({
  el:'#app',
  data:{
    repositories : [],
    filterBy: 'challenge',
    idSheets: '1YSGreI32MRiFxdMOahJ25TV-jZlUGcUsxSoJZubWcu8',
    apiKey: 'AIzaSyAAPKL_m1UKJlliH9_jmLiO2tsTGRiiIsU',
    ranges:{
      challenge: {
        from: 0,
        to: 0,
        loadMore: true
      },
      lab: {
        from: 0,
        to: 0,
        loadMore: true
      }
      ,
      reference: {
        from: 0,
        to: 0,
        loadMore: true
      }
    },
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
    filterByType(type){
      this.filterBy = type
    },
    getRepositories(){
      if(this.ranges[this.filterBy].loadMore){
        let from = this.ranges[this.filterBy].to + 1
        let to = this.ranges[this.filterBy].to + 30
        let loadMore = this.ranges[this.filterBy].loadMore
        let values = `${this.filterBy}!A${from}:AZ${to}`

        fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${this.idSheets}/values/${values}?access_token=${this.apiKey}&key=${this.apiKey}`)
        .then((repositories)=>{
          return repositories.json()
        })
        .then((repositories)=>{
          if(repositories.values){
            this.repositories = this.repositories.concat(repositories.values);
          }else{
            loadMore = false
          }
        })
        .catch(err=>{
          console.log(err);
        })

        Vue.set(this.ranges, this.filterBy, {from, to, loadMore})
      }
    },
    handleScroll() {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50){
        this.getRepositories();
      }
    }
  },
  watch: {
    filterBy() {
      this.getRepositories()
    }
  }
 })