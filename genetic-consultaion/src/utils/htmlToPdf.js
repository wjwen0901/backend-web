// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (dom, title) {
      console.log(dom)
      console.log(document.querySelector('#pdf-doc'))
      console.log(document.querySelector('#pdf-doc').width)
      let fileTitle = title
      let c = document.createElement('canvas')
      let opts = {
        scale: 2,
        canvas: c,
        logging: true,
        width: document.querySelector(dom).width,
        height: document.querySelector(dom).height
      }
      c.width = document.querySelector(dom).width * 2
      c.height = document.querySelector(dom).height * 2
      c.getContext('2d').scale(2, 2)
      html2Canvas(document.querySelector(dom), opts).then(function () {
        let contentWidth = c.width
        let contentHeight = c.height
        let pageHeight = contentWidth / 595 * 842
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595
        let imgHeight = 595 / contentWidth * contentHeight
        let pageData = c.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 842
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(fileTitle + '.pdf')
      })
    }
  }
}
