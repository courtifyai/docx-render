const fs = require('fs');
const JSZip = require('jszip');

async function readComments() {
  const data = fs.readFileSync('contract.docx');
  const zip = await JSZip.loadAsync(data);
  const commentsXml = await zip.file('word/comments.xml')?.async('string');
  
  if (commentsXml) {
    console.log('Comments XML length:', commentsXml.length);
    console.log('Content:', commentsXml);
  } else {
    console.log('comments.xml not found');
  }
}

readComments().catch(err => {
  console.error('Error:', err.message);
});
