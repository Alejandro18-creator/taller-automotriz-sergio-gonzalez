function generarLayout({ titulo, contenido }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f4f4;
  font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table
width="600"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:10px;
overflow:hidden;
border:1px solid #dddddd;
">

<tr>
<td
style="
background:#1f2937;
padding:25px;
text-align:center;
color:#ffffff;
">

<h1 style="margin:0;font-size:26px;">
🚗 Taller Automotriz Sergio González
</h1>

<p style="margin-top:8px;">
${titulo}
</p>

</td>
</tr>

<tr>
<td style="padding:35px;">

${contenido}

</td>
</tr>

<tr>
<td
style="
background:#f7f7f7;
padding:20px;
font-size:13px;
text-align:center;
color:#666;
">

Taller Automotriz Sergio González<br>

📞 +56 9 7552 0550

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}

module.exports = generarLayout;