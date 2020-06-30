// import * as path from 'path';
// import * as fsExtra from 'fs-extra';
// import * as userHome from 'user-home';
// import compile from '@iceworks/dsl2code';
// import axios from 'axios';
// // import { Injector } from '@ali/common-di';
// // import { IFileService, FileService } from '@iceworks/utils/lib/node/file.service';
// import { IMaterialBlock } from '@iceworks/material-utils';

// // 工作台中所有物料库配置数据地址
// const COMPONENTSMAP_URL = 'http://iceworks.oss-cn-hangzhou.aliyuncs.com/iceluna/componentsMap.json';
// // 物料库数据
// let componentsMapData: object = {};

// // iceworks 全局存储本地区块目录
// const blocksPath = path.join(userHome, '.iceworks', 'blocks_4');

// export async function downloadLocalBlock(block: { name: string; oriName: string }, targetDir: string, log: (text: string) => void): Promise<string> {
//   const { name: blockName, oriName } = block;
//   await fsExtra.mkdirp(targetDir);
//   const blockFileName = `${oriName}.json`;
//   const codeFileName = `${oriName}.jsx`;

//   log('正在生成区块代码');
//   await generateBlockCode(blockFileName);

//   const blockDir = path.join(targetDir, blockName);
//   const blockCodePath = path.join(blocksPath, codeFileName);
//   const targetFilePath = path.join(blockDir, 'index.jsx');

//   await fsExtra.copy(blockCodePath, targetFilePath);
//   await fsExtra.remove(blockCodePath);

//   return blockDir;
// }

// /**
//  * 获取物料库数据
//  */
// async function fetchComponentsMapData() {
//   try {
//     const { data } = await axios.get(COMPONENTSMAP_URL);
//     componentsMapData = data;
//   } catch (e) {
//     // ignore error
//   }
// }

// /**
//  * 生成区块代码
//  */
// async function generateBlockCode(fileName) {
//   const injector = new Injector();
//   injector.addProviders({
//     token: IFileService,
//     useClass: FileService,
//   });

//   const fileService = injector.get(IFileService);
//   const fileContent = fileService.get(fileName);
//   const blockName = fileName.split('.json')[0];
//   let schema = '';
//   try {
//     schema = JSON.parse(fileContent);
//   } catch (e) {
//     // ignore error
//   }
//   if (!componentsMapData) {
//     await fetchComponentsMapData();
//   }
//   const codeFiles = compile(schema, componentsMapData);
//   const { value: codefileContent } = codeFiles[0];
//   const codeFileName = `${blockName}.jsx`;
//   fileService.update(codeFileName, codefileContent);
// }
