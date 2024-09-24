<template>
  <div id="app">
    <h1>Generar PDF de Materias</h1>
    <button @click="generarPDF">Generar PDF</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  methods: {
    generarPDF() {
      axios.post('http://localhost:3000/generar-pdf', {}, { responseType: 'blob' })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'reporte.pdf');
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error('Error generando el PDF:', error);
        });
    }
  }
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 50px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
