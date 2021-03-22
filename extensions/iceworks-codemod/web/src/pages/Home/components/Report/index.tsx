import React from 'react';

const Report = ({ name, transforms = [] }) => {
  return (
    <div>
      <div>
        <h2>
          {name}
        </h2>
      </div>
      <div>
        {
          transforms.map(({ name: tname, files }) => {
            return (
              <div>
                <div>
                  <h3>{tname}</h3>
                </div>
                <ul>
                  {
                    files.map(({ path }) => {
                      return (
                        <li>
                          {path}
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Report;
