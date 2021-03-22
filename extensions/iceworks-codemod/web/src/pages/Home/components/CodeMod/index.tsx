import { Button, Checkbox } from '@alifd/next';
import Report from '../Report';

const CodeMod = ({ codeMod, onChangeAll, onChangeOne }) => {
  const { name: cname, transforms = [] } = codeMod;
  return (
    <div>
      <label>
        <Checkbox onChange={(v) => onChangeAll(v, cname)} />
        Select All
      </label>
      <div>
        {
          transforms.map(({ name: tname, filePath, checked }) => {
            return (
              <label>
                <Checkbox
                  key={tname}
                  value={filePath}
                  onChange={(v) => onChangeOne(v, cname, filePath)}
                  checked={checked}
                />
                {tname}
              </label>
            );
          })
        }
      </div>
      <div>
        <Button type="primary">
          Scan
        </Button>
      </div>
      <div>
        <Report name={cname} />
      </div>
    </div>
  );
};

export default CodeMod;
