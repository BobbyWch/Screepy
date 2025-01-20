import clear from 'rollup-plugin-clear'
import screeps from 'rollup-plugin-screeps'
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

let config
// 根据指定的目标获取对应的配置项
if (!process.env.DEST) console.log("未指定目标, 代码将被编译但不会上传")
else if (!(config = require("./.secret.json")[process.env.DEST])) {
    throw new Error("无效目标，请检查 secret.json 中是否包含对应配置")
}
// 根据指定的配置决定是上传还是复制到文件夹
const pluginDeploy = config && config.copyPath ?
    // 复制到指定路径
    copy({
        targets: [
            {
                src: 'dist/main.js',
                dest: config.copyPath
            },
            {
                src: 'src/mount/room/plan/algo_wasm_priorityqueue.wasm',
                dest: config.copyPath
            },
            {
                src: 'src/mount/room/plan/autoPlanner63.js',
                dest: config.copyPath
            },
            {
                src: 'src/lib/helper_roomResource.js',
                dest: config.copyPath
            },
            {
                src: 'src/lib/stack_analyse.js',
                dest: config.copyPath
            },
            {
                src: 'src/lib/chat.js',
                dest: config.copyPath
            },
            // {
            //     src: 'dist/main.js.map',
            //     dest: config.copyPath,
            //     rename: name => name + '.map.js',
            //     transform: contents => `module.exports = ${contents.toString()};`
            // }
        ],
        hook: 'writeBundle',
        verbose: true
    }) :
    // 更新 .map 到 .map.js 并上传
    screeps({ config, dryRun: !config })

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: false//这里设置是否生成.map
    },
    plugins: [
        // 清除上次编译成果
        clear({ targets: ["dist"] }),
        // 打包依赖
        resolve(),
        // 模块化依赖
        commonjs(),
//         terser({
// // remove all comments
//             format: {
//                 comments: false
//             },
// // prevent any compression
//             compress: false
//         }),
        copy({
            targets: [
                {
                    src: 'src/mount/room/plan/algo_wasm_priorityqueue.wasm',
                    dest: 'dist'
                },
                {
                    src: 'src/mount/room/plan/autoPlanner63.js',
                    dest: 'dist'
                },
                {
                    src: 'src/lib/helper_roomResource.js',
                    dest: 'dist'
                },
                {
                    src: 'src/lib/stack_analyse.js',
                    dest: 'dist'
                },
                {
                    src: 'src/lib/chat.js',
                    dest: 'dist'
                }
            ]
        }),
        typescript({ tsconfig: "./tsconfig.json" }),
        // 执行上传或者复制
        pluginDeploy
    ]
};