import $ from 'jquery';
import 'datatables.net';
import wilddog from 'wilddog';
import moment from 'moment/min/moment-with-locales.min';

$(function () {

  // 这个是 Cloudinsight Dev 插件专用的嗷
  const config = {
    syncURL: "h0r0rop9h6vu9k8oxge5.wilddogio.com",
    authDomain: "h0r0rop9h6vu9k8oxge5.wilddog.com"
  };

  // 隐藏 Datatable 的报错
  $.fn.dataTable.ext.errMode = 'none';
  wilddog.initializeApp(config);

  $("#login").click(function () {
    const key = localStorage.getItem('key') || '';
    const keyInput = window.prompt('请输入超级密钥', key);
    if (keyInput) {
      wilddog
        .auth()
        .signInWithCustomToken(keyInput)
        .then(()=>{
          localStorage.setItem('key', keyInput);
          $("#login").attr('disabled', 'disabled').text('登录成功');
        })
        .catch(()=>alert('登录失败'));
    }
  });

  // 检测到数据更新就重新绘制表格
  const ref = wilddog.sync().ref('versions');
  ref.on("value", function (res) {
    const originalData = res.val();
    const data = Object.keys(originalData).map(key=>Object.assign(originalData[key], {
      key: key
    }));
    $("#container").DataTable({
      paging: false,
      destroy: true, // 销毁现有的 table
      data: data,
      columns: [
        {
          data: 'BUILD_ID',
          title: '构建号',
          createdCell: (td, cellData, rowData)=>$(td)
            .empty()
            .append(
              $('<a>')
                .attr({
                  href: rowData.BUILD_URL,
                  target: '_blank'
                })
                .text('#' + rowData.BUILD_ID)
            )
        },
        {
          data: 'key',
          title: '操作',
          createdCell: (td, cellData, rowData)=>$(td)
            .empty()
            .append(
              $('<button>')
                .text('删除')
                .attr('disabled', !rowData.BUILD_TIME) // 如果没有 BuiltTime 就无法删除
                .click(function () {
                  ref.ref(rowData.key).remove();
                  console.log(rowData.key)
                })
            )
        },
        {
          data: 'GIT_BRANCH',
          title: 'GIT_BRANCH'
        },
        {
          data: 'URL',
          title: 'URL'
        },
        {
          data: 'BUILD_TIME',
          render: {
            display: val=>val && moment(val).format('YYYY-MM-DD HH:mm:ss')
          },
          defaultContent: 'N/A'
        }
      ]
    })
  });
});
