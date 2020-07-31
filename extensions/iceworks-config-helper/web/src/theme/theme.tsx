import fdCheckBox from './checkBox';
import fdEditInFile from './EditInFile';
import fdTextInput from './fdTextInput';
import titleFiled from './TitleFiled';
import descriptionField from './DescriptionField';
import FiledTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import selectWidget from './fdSelectWidge';

export const fields = {
  TitleFiled: titleFiled,
  DescriptionField: descriptionField,
  ArrayField: fdEditInFile,
  EditInFile: fdEditInFile,
};

export const widgets = {
  CheckboxWidget: fdCheckBox,
  TextWidget: fdTextInput,
  SelectWidget: selectWidget,
};
export const templates = {
  FiledTemplate,
  ObjectFieldTemplate,
};
