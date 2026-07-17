function generarLayout({ titulo, contenido }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    background:#f5f5f5;
    color:#333;
    padding:30px 15px;
}

.contenedor{
    max-width:650px;
    margin:auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 8px 30px rgba(0,0,0,.12);
}

.header{
    background:#1c1c1c;
    text-align:center;
    padding:35px;
}

.logo{
    width:120px;
    margin-bottom:15px;
}

.header h1{
    color:#ffffff;
    font-size:24px;
}

.cuerpo{
    padding:40px;
    line-height:1.8;
    font-size:16px;
    color:#444;
}

.tarjeta{
    background:#f8f8f8;
    border-left:5px solid #d91515;
    border-radius:10px;
    padding:20px;
    margin:25px 0;
}

.tarjeta strong{
    color:#1c1c1c;
}

.texto-secundario{
    color:#777;
    font-size:14px;
}

.cuerpo h2{
    color:#d91515;
    margin-bottom:20px;
}

.boton{
    display:inline-block;
    margin-top:25px;
    background:#d91515;
    color:#fff !important;
    text-decoration:none;
    padding:14px 28px;
    border-radius:8px;
    font-weight:bold;
}

.footer{
    background:#1c1c1c;
    color:#ccc;
    text-align:center;
    padding:25px;
    font-size:13px;
}

.footer strong{
    color:#fff;
}
</style>
</head>

<body>

<div class="contenedor">

    <div class="header">

        <!-- Aquí irá el logo -->
        <h1 style="color:#fff;font-size:30px;margin-bottom:8px;">
    Taller Automotriz
</h1>

<p style="color:#d91515;font-size:20px;font-weight:bold;">
    Sergio González
</p>

<hr style="margin:25px auto;width:70px;border:2px solid #d91515;">

    </div>

    <div class="cuerpo">

        ${contenido}

    </div>

    <div class="footer">

    <strong>Taller Automotriz Sergio González</strong><br>
    Especialistas en mantenimiento y reparación automotriz<br><br>

    Gracias por confiar en nosotros.

</div>

</div>

</body>
</html>
`;
}

module.exports = generarLayout;
