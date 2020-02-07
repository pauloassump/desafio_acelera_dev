<template>
  <div id="app">
    <h3>Gerando Token</h3>
    <div>
      <strong>Token:</strong>
      <input
        ref="token"
        outlined
        color="orange"
        readonly
        style="width:50%;"
        :value="info.data.token"
      >
    </div>

    <div>
      <strong>Cifrado:</strong>
      <input
        ref="cifrado"
        outlined
        color="orange"
        readonly
        style="width:50%;"
        :value="info.data.cifrado"
      >
    </div>
    <div>
      <strong>Decifrado:</strong>
      <input
        id="key"
        ref="decifrado"
        outlined
        color="orange"
        v-model="input_output"
        style="width:50%;"
        rows="4" wrap="soft"
      >
    </div>
    <div>
      <strong>Resumo Criptográfico:</strong>
      <input
        ref="rCripto"
        outlined
        color="orange"
        readonly
        :value="info.data.resumo_criptografico"
        style="width:50%;"
      >
    </div>
    <div>
      <input type="file" @change="onFileSelected">
    </div>
    <button value="Decode" @click="encodeDecodeText">
      Decifrar Texto
    </button>
    <button @click="saveFile()">
          Download <strong>Token</strong>
    </button>
    <button ref="uploadBtn" @click="onUpload()">
          Enviar <strong>Arquivo</strong>
    </button>
    <!-- Teste
    <button ref="uploadBtn" @click="sendDesafio()">
          Enviar <strong>Desafio</strong>
    </button>
    -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      info: null,
      input_output: '',
      key: 'tuvwxyzabcdefghijklmnopqrs',
      selectedFile: null,
    }
  },
  mounted () {
    axios
      .get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=e7e67c6ea3af814c77c5f20504d54fe0ecc4c2d7')
      .then(response => (this.info = response))
  },
  methods: {
    getCod () {
      this.info.decifrado = this.info.cifrado
    },
    saveFile () {
      const data = JSON.stringify(this.info.data)
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = "answer.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    encodeDecodeText () {
      var sha1 = require('sha1');
      var vm = this,  
          textin = vm.input_output.replace(/\r/gi,''),
          subkey = vm.key.split('');
          textin = textin.split('\n');
      var letters = '';
      var lettersout = new Array();
      var textout = new Array();
        for(var x=0;x<textin.length;x++){
          letters = textin[x].split('');
        for(var y=0;y<letters.length;y++){
          if(letters[y].toLowerCase().match(/[a-z]/)){
            if(letters[y].match(/[a-z]/)) lettersout[y] = subkey[letters[y].charCodeAt(0)-97]; else lettersout[y] = subkey[letters[y].charCodeAt(0)-65].toUpperCase();
          } else lettersout[y] = letters[y];}
            textout[x] = lettersout.join('');
            lettersout = new Array();}
            textout = textout.join('\n');
            vm.input_output = textout;

            this.info.data.decifrado = textout
            this.info.data.resumo_criptografico = sha1(textout)
        },
        onFileSelected (event) {
          this.selectedFile = event.target.files[0]
        },
        onUpload () {
          const headers = { 'Content-Type': 'multipart/form-data' }
          const fd = new FormData();
          fd.append('answer', this.selectedFile, 'answer.json')
          axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=e7e67c6ea3af814c77c5f20504d54fe0ecc4c2d7', fd, headers).then(res => { // eslint-disable-next-line no-console
            console.log(res) // eslint-disable-next-line no-console
          })
        }
        /*sendDesafio () {
          const fs = require('fs')
          const path = require('path')
          const fd = new FormData();
          fd.append('answer', this.selectedFile, this.selectedFile.name, {
            filename: 'answer.json'
          })

          const pathJson = path.resolve(__dirname, 'tmp', 'answer.json')
            const headers = {
              'Content-Type': 'multipart/form-data'
            }
            const r = axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=e7e67c6ea3af814c77c5f20504d54fe0ecc4c2d7', headers, fd)
            const form = r.form()
            form.append('answer', fs.createReadStream(pathJson), {
              filename: 'answer.json'
            })
        }*/
    }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
