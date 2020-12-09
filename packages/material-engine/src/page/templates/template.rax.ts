const templateStr = `import { createElement } from 'rax';
import View from 'rax-view';
<% for(var i = 0; i < blocks.length; i++) { -%>
import <%= blocks[i].className %> from '<%= blocks[i].relativePath -%>';
<% } -%>

export default function () {
  return (
    <View className="<%= pageName %>-page">
      <% for(var i = 0; i < blocks.length; i++){ -%>
      <% if (blocks[i].description) { %>{/* <%= blocks[i].description -%> */}<% } %>
      <<%= blocks[i].className -%> />
      <% } -%>
    </View>
  );
}
`;
export default templateStr;
