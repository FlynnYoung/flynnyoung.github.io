const fs = require('fs');
const path = require('path');

/**
 * 生成 docs/press 子目录的 index.md 文件
 * @param {Object} options - 配置选项
 * @param {string} options.sourceDir - 源目录路径，默认 docs/press
 * @param {string[]} options.excludeDirs - 排除的文件夹列表
 * @returns {Promise<void>}
 */
async function generatePressIndex(options = {}) {
  const {
    sourceDir = path.join(__dirname, 'docs', 'press'),
    excludeDirs = ['public']
  } = options;

  let totalFilesGenerated = 0;

  /**
   * 提取 Markdown 文件的标题和排序值
   * @param {string} filePath - Markdown 文件路径
   * @returns {Object} 包含标题和排序值的对象
   */
  function extractTitleAndSort(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let title = '';
      let sort = Infinity; // 默认排序值为无限大，排在最后
      
      // 尝试从 frontmatter 中提取 title 和 sort
      const frontmatterMatch = content.match(/^---[\s\S]*?---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[0];
        
        // 提取 title
        const titleMatch = frontmatter.match(/title:\s*(.+)/);
        if (titleMatch) {
          title = titleMatch[1].trim();
        }
        
        // 提取 sort
        const sortMatch = frontmatter.match(/sort:\s*(\d+)/);
        if (sortMatch) {
          sort = parseInt(sortMatch[1], 10);
        }
      }
      
      // 如果没有提取到标题，尝试从 # 标题 中提取
      if (!title) {
        const headingMatch = content.match(/^#\s+(.+)$/m);
        if (headingMatch) {
          title = headingMatch[1].trim();
        }
      }
      
      // 如果仍然没有标题，使用文件名作为标题
      if (!title) {
        title = path.basename(filePath, '.md');
      }
      
      return {
        title,
        sort
      };
    } catch (error) {
      // 出错时使用文件名作为标题，排序值为无限大
      return {
        title: path.basename(filePath, '.md'),
        sort: Infinity
      };
    }
  }

  /**
   * 处理目录，生成 index.md 文件
   * @param {string} dir - 当前目录
   */
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    // 收集当前目录的文章
    const articles = [];

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && path.extname(file) === '.md' && file !== 'index.md') {
        // 提取标题和排序值
        const { title, sort } = extractTitleAndSort(filePath);
        
        // 生成相对路径（相对于当前目录）
        const relativePath = path.relative(dir, filePath);
        const linkPath = relativePath.replace(/\\/g, '/'); // 统一使用正斜杠

        articles.push({
          title,
          path: linkPath,
          sort
        });
      }
    });

    // 按 sort 字段升序排序，没有 sort 字段的排在后面
    articles.sort((a, b) => a.sort - b.sort);

    const outputFile = path.join(dir, 'index.md');
    
    if (articles.length > 0) {
      if (fs.existsSync(outputFile)) {
        // 如果 index.md 已存在，读取现有内容
        let existingContent = fs.readFileSync(outputFile, 'utf8');
        
        // 提取 frontmatter 和目录部分
        const frontmatterMatch = existingContent.match(/^---[\s\S]*?---/);
        const frontmatter = frontmatterMatch ? frontmatterMatch[0] : `---\npublish: false\nhideSidebar: true\n---`;
        
        // 提取标题部分
        const titleMatch = existingContent.match(/---[\s\S]*?# (.*?)\n/);
        const title = titleMatch ? titleMatch[1] : '文章列表';
        
        // 重新生成目录内容
        let newContent = `${frontmatter}\n\n# ${title}\n\n## 目录\n\n`;
        
        // 输出所有文章
        articles.forEach(article => {
          newContent += `- [${article.title}](${article.path})\n`;
        });
        
        // 写入更新后的内容
        fs.writeFileSync(outputFile, newContent);
        totalFilesGenerated++;
      } else {
        // 生成新的 index.md 文件
        let markdownContent = `---
publish: false
hideSidebar: true
---

## 目录

`;

        // 输出所有文章
        articles.forEach(article => {
          markdownContent += `- [${article.title}](${article.path})\n`;
        });

        // 写入 index.md 文件
        fs.writeFileSync(outputFile, markdownContent);
        totalFilesGenerated++;
      }
    } else if (fs.existsSync(outputFile)) {
      // 如果没有文章但存在 index.md 文件，删除它
      fs.unlinkSync(outputFile);
      totalFilesGenerated++;
    }
  }

  // 读取 docs/press 目录下的子目录
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory() && !excludeDirs.includes(file)) {
      // 处理子目录
      processDirectory(filePath);
    }
  });

  console.log(`✅ 文章目录生成完成`);
  console.log(`📁 共生成 ${totalFilesGenerated} 个 index.md 文件`);
  console.log(`⚠️  已排除 ${excludeDirs.join(', ')} 等文件夹`);
}

// 执行脚本
if (require.main === module) {
  generatePressIndex();
}

module.exports = generatePressIndex;