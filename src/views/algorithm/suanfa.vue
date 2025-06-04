<template>
  <div class="image-analysis-container">

    <el-row :gutter="20" class="main-layout">
      <!-- 左侧操作区 -->
      <!-- 图片选择与预览区域 -->
      <el-col :span="12" class="left-panel">
        <div class="image-upload-section">
          <h2 class="section-title">
            图像处理
          </h2>
          <div class="camera-controls">
            <el-button-group class="header-buttons">
<!--              <el-button-->
<!--                  size="small"-->
<!--                  type="primary"-->
<!--                  :icon="cameraActive ? 'el-icon-switch-button' : 'el-icon-video-camera'"-->
<!--                  @click="toggleCamera"-->
<!--              >-->
<!--                {{ cameraActive ? '关闭摄像头' : '开启摄像头' }}-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                  size="small"-->
<!--                  :disabled="!cameraActive"-->
<!--                  @click="capturePhoto"-->
<!--              >-->
<!--                拍照-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                  size="small"-->
<!--                  :disabled="!cameraActive"-->
<!--                  :type="isRecording ? 'danger' : 'success'"-->
<!--                  @click="toggleRecording"-->
<!--              >-->
<!--                {{ isRecording ? '停止录制' : '开始录制' }}-->
<!--              </el-button>-->
              <el-button type="primary" size="small" @click="showUploadGuide"
                         style="margin-right: 15px;">
                算法引导
              </el-button>
              <el-upload
                  class="upload-demo"
                  action="#"
                  :on-change="(file) => handleFileChange(file)"
                  :auto-upload="false"
                  :show-file-list="false"
              >
                <el-button slot="trigger" size="small" type="primary">
                  {{
                    currentFile ? (currentFile.name.length > 5 ? currentFile.name.slice(0, 5) + '...' : currentFile.name) : '选择文件'
                  }}
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="openSelectPatientDialog"
                >
                  {{ selectedPatient ? selectedPatient.name : '选择患者' }}
                </el-button>

                <el-button type="success" size="small" @click="uploadfile">
                  上传分析
                </el-button>
                <!-- TODO 摄像头预览区域 -->

                <canvas ref="canvas" style="display: none;"/>
              </el-upload>
            </el-button-group>
          </div>

          <!-- 摄像头预览区域 -->
<!--          <div class="camera-preview-container">-->
<!--            <video-->
<!--                v-show="cameraActive"-->
<!--                ref="videoPreview"-->
<!--                class="camera-preview"-->
<!--                autoplay-->
<!--            />-->
<!--          </div>-->
          <!-- 图片预览区域 -->
          <div v-if="imageUrl || videoUrl" class="image-preview">
            <img
                v-if="imageUrl && !videoUrl"
                :src="imageUrl"
                :alt="selectedAlgorithm"
                style="width: 80%; height: 60vh;"
            >
            <video
                v-else
                :src="videoUrl"
                controls
                autoplay
                style="width: 80%; height: 60vh; object-fit: contain;"
            />
          </div>
          <div v-else-if="currentFile && !isImageOrVideo(currentFile)" class="image-placeholder" style="color: #42b983;">
            <i class="el-icon-document"></i> 已选择文件：{{ currentFile.name }}
          </div>

          <div v-else class="image-placeholder">
            <i class="el-icon-upload"/>
            <p>请先上传文件获取分析结果</p>
          </div>

          <!-- 算法选择区域 -->
          <div class="algorithm-selection" style="margin-top: 20px;">
            <h3>选择分析算法：</h3>
            <el-radio-group v-model="selectedAlgorithm" style="display: flex; gap: 5px; width: 100%">
              <el-radio label="微表情图像处理" border circle style="flex:1; white-space: nowrap; margin: 0">
                微表情图像处理
              </el-radio>
              <el-radio label="MR脑组织图像处理" border circle style="flex:1; white-space: nowrap; margin: 0">
                MR脑组织图像处理
              </el-radio>
              <el-radio label="MR中脑核团图像处理" border circle style="flex:1; white-space: nowrap; margin: 0">
                MR中脑核团图像处理
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-col>

      <!-- 右侧结果展示区 -->
      <el-col :span="12" class="right-panel">
        <div class="result-image-section">
          <div class="result-header">
            <h2 class="section-title"> 处理结果 </h2>
            <div class="button-group">
              <el-button
                  type="primary"
                  size="small"
                  :disabled="!analysisResultUrl"
                  style="
                background-color: #67C23A;
                border-color: #67C23A;
                color: white;
                margin-left: 10px;
              "
                  @click="downloadAnalysisResultUrl(analysisResultUrl)"
              >
                下载图像
              </el-button>

              <el-button
                  type="primary"
                  size="small"
                  :disabled="!analysisResult"
                  style="margin-left: 10px;"
                  @click="detailVisible = true"
              >
                分析详情
              </el-button>

              <el-button
                  type="primary"
                  size="small"
                  :disabled="!analysisResult"
                  style="
              background-color: #409EFF;
              border-color: #409EFF;
              color: white;
              margin-left: 10px;
              "
                  @click="downloadAnalysisReport"
              >
                下载分析详情报告
              </el-button>

              <el-button
                  type="primary"
                  size="small"
                  :disabled="!isMicroExpression"
                  style="margin-left: 10px;"
                  @click="showEmotionChart"
              >
                微表情分析图
              </el-button>
              <el-button
                  type="primary"
                  size="small"
                  :disabled="!analysisResultUrl"
                  style="
                  background-color: #9c27b0;
                  border-color: #9c27b0;
                  color: white;
                  margin-left: 10px; "
                  @click="showAdjustDialog"
              >
                多参数调节
              </el-button>
            </div>
          </div>

          <!-- 分析结果图展示 -->
          <template v-if="analysisResultUrl">
            <el-image
                :src="analysisResultUrl"
                :preview-src-list="[analysisResultUrl]"
                style="width: 100%; height: 60vh;"/>
          </template>
          <div v-else class="image-placeholder">
            <i class="el-icon-upload"/>
            <p>请先上传图片获取分析结果</p>
          </div>

        </div>
      </el-col>
    </el-row>
    <!-- 修改弹窗模板 -->
    <el-dialog
        title="微情感分析图表"
        :visible.sync="chartVisible"
        width="55%"
        top="5vh"
        custom-class="chart-dialog"
        @close="() => { if(this.chartInstance) this.chartInstance.dispose() }"
    >
      <div ref="chartContainer" style="width: 100%; height: 65vh; padding: 20px;"></div>
    </el-dialog>

    <el-dialog
        title="分析详情"
        :visible.sync="detailVisible"
        width="55%"
        top="5vh"
        custom-class="chart-dialog"
    >
      <el-input
          type="textarea"
          :rows="20"
          :value="analysisResult ? formatAnalysis(analysisResult) : ''"
          readonly
          resize="none"
          style="overflow-y: auto; padding: 15px;"
      />
    </el-dialog>
    <el-dialog
        title="图像参数调节"
        :visible.sync="adjustmentVisible"
        width="60%"
        top="5vh"
    >
      <div style="display: flex; flex-direction: column; height: 70vh;">
        <!-- 图像预览 -->
        <div style="flex: 1; min-height: 300px; margin-bottom: 20px;">
          <canvas ref="previewCanvas" style="width: 100%; height: 100%;"></canvas>
        </div>

        <!-- 调节控件 -->
        <div class="adjustment-controls" style="overflow-y: auto; padding: 0 20px;">
          <div class="adjust-item">
            <span>分辨率: {{ adjustmentParams.resolution }}%</span>
            <el-slider
                v-model="adjustmentParams.resolution"
                :min="5"
                :max="200"
                @input="handleParamChange"
            />
          </div>
          <div class="adjust-item">
            <span>对比度: {{ adjustmentParams.contrast }}%</span>
            <el-slider
                v-model="adjustmentParams.contrast"
                :min="5"
                :max="200"
                @input="handleParamChange"
            />
          </div>
          <div class="adjust-item">
            <span>亮度: {{ adjustmentParams.brightness }}%</span>
            <el-slider
                v-model="adjustmentParams.brightness"
                :min="5"
                :max="200"
                @input="handleParamChange"
            />
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 患者选择弹窗 -->
    <el-dialog
        title="选择患者"
        :visible.sync="selectDialogVisible"
        width="60%"
    >
      <label style="margin: 10px">患者姓名：</label>
      <el-input v-model="inputName"
                placeholder="患者姓名"
                style="width: 15%"
                clearable
                @clear="init"
                @keyup.enter.native="initFun"
      />
      <label style="margin: 10px">患者编号：</label>
      <el-input v-model="patientId"
                placeholder="患者编号"
                style="width: 15%"
                clearable
                @clear="init"
                @keyup.enter.native="initFun"
      />
      <el-button
          type="success"
          size="small"
          @click="initFun" style="margin-left: 10px;"
      >
        查询
      </el-button>
      <div class="patient-select-container">
        <el-table
            :data="patientList"
            @row-click="handlePatientSelect"
            highlight-current-row
        >
          <el-table-column prop="name" label="姓名"/>
          <el-table-column prop="patientId" label="患者编号"/>
          <el-table-column label="性别">
            <template slot-scope="{ row }">
              {{ row.sex === '1' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄"/>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
            :page-sizes="patientPageSizes"
            :page-size="patientPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="patientTotal"
            :current-page="patientPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" style="margin-top: 16px; text-align: center;"
        />
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="selectDialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>
    <!-- 上传引导弹窗 -->
    <el-dialog
        title="算法引导"
        :visible.sync="uploadGuideVisible"
        width="80%"
        top="5vh"
    >
      <div style="text-align: center;">
        <img :src="uploadGuideImage" alt="上传引导图" style="max-width: 100%; height: auto;" />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {upload} from '@/api/algorithm.ts';
import {getPatientPage} from '@/api/Patient';
import * as echarts from 'echarts';

export default {
  data() {
    return {
      selectedAlgorithm: '微表情图像处理',
      imageUrl: '',
      videoUrl: '',
      analysisResult: '', // 分析结果详情
      analysisResultUrl: '', // 分析结果URL
      cameraStream: null, // 摄像头流
      isVideo: false, // 是否为视频
      mediaRecorder: null, // 媒体录制器
      recordedChunks: [], // 录制的视频片段
      cameraActive: false, // 摄像头是否激活
      isRecording: false, // 是否正在录制
      chartVisible: false,
      chartInstance: null,
      detailVisible: false, // 新增弹窗控制状态
      adjustmentVisible: false, // 调整参数弹窗控制状态
      adjustmentParams: { // 调整参数
        resolution: 100, // 分辨率
        contrast: 100, // 对比度
        brightness: 100 // 亮度
      },
      selectedPatient: null, // 当前选中的患者对象
      patientList: [], // 所有可选患者数据
      selectDialogVisible: false, // 患者选择弹窗是否可见
      patientPage: 1, // 当前页码
      patientPageSize: 10, // 每页条数
      patientPageSizes: [10, 20, 30, 50], // 每页条数选项
      patientTotal: 0, // 总条数
      loadingPatients: false, // 加载状态
      inputName: '',
      patientId: '',
      uploadGuideVisible: false, // 控制上传引导弹窗是否可见
      uploadGuideImage: require('@/assets/图片加载引导.png')

    };
  },
  computed: {
    isMicroExpression() {
      return this.analysisResult &&
          this.analysisResult.algorithm &&
          this.analysisResult.algorithm.includes('微表情图像处理');
    }
  },
  destroyed() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {

    showUploadGuide() {
      this.uploadGuideVisible = true;
    },
    testVideoUrl() {
      if (!this.videoUrl) {
        this.$message.error('没有可用的视频链接');
        return;
      }

      // 创建 video 元素
      const video = document.createElement('video');
      video.src = this.videoUrl;
      video.controls = true;
      video.style.width = '100%';
      video.style.maxWidth = '800px';
      video.style.marginTop = '20px';

      // 创建容器并插入页面
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      container.style.backgroundColor = '#fff';
      container.style.padding = '20px';
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      container.appendChild(video);

      document.body.appendChild(container);

      // 自动移除
      setTimeout(() => {
        document.body.removeChild(container);
      }, 6000); // 显示6秒后自动关闭
    },

    isImageOrVideo(file) {
      return file && (
          file.type.startsWith('image/') ||
          file.type.startsWith('video/')
      );
    },
    // 文件选择处理
    handleFileChange(file) {
      const selectedFile = file.raw;
      // 清除上一次的文件引用和预览数据
      this.currentFile = null;
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl);
        this.videoUrl = null;
      }
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null;
      }
      // 判断文件类型
      if (selectedFile.type.startsWith('image/')) {
        // 图片：生成 DataURL 预览
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
        this.isVideo = false;
      } else if (selectedFile.type.startsWith('video/')) {
        // 视频：生成 Blob URL 预览
        this.videoUrl = URL.createObjectURL(selectedFile);
        this.isVideo = true;
      } else {
        // 其他文件：直接保存，不预览，仅提示文件名
        this.$message.success(`已选择文件: ${selectedFile.name}`);
        this.isVideo = false;
      }
      // 设置当前文件对象
      this.currentFile = selectedFile;
      this.$forceUpdate(); // 强制更新视图
    },
    // // 摄像头开关处理
    // async toggleCamera() {
    //   if (this.cameraActive) {
    //     this.closeCamera();
    //   } else {
    //     try {
    //       const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    //       this.$refs.videoPreview.srcObject = stream;
    //       this.cameraActive = true;
    //     } catch (error) {
    //       this.$message.error('摄像头访问失败: ' + error.message);
    //     }
    //   }
    // },
    // // 摄像头关闭处理
    // closeCamera() {
    //   const video = this.$refs.videoPreview;
    //   if (video.srcObject) {
    //     video.srcObject.getTracks().forEach(track => track.stop());
    //     video.srcObject = null;
    //   }
    //   this.cameraActive = false;
    //   this.isRecording = false;
    // },
    // // 摄像头拍照处理
    // capturePhoto() {
    //   const video = this.$refs.videoPreview;
    //   const canvas = document.createElement('canvas');
    //   canvas.width = video.videoWidth;
    //   canvas.height = video.videoHeight;
    //   canvas.getContext('2d').drawImage(video, 0, 0);
    //
    //   canvas.toBlob(blob => {
    //     const file = new File([blob], `photo_${Date.now()}.jpg`, {
    //       type: 'image/jpeg'
    //     });
    //     this.currentFile = file;
    //     this.isVideo = false;
    //     this.handleMediaFile(file);
    //   }, 'image/jpeg');
    // },
    // 上传图片到后端
    // 上传文件
    async uploadfile() {
      if (!this.currentFile) {
        this.$message.error('请先选择文件');
        return;
      }
      if (!this.selectedPatient) {
        this.$message.warning('请选择一位患者');
        return;
      }

      let mediaType = 'null';
      if (this.currentFile.type.startsWith('image/')) {
        mediaType = 'image';
      } else if (this.currentFile.type.startsWith('video/')) {
        mediaType = 'video';
      } else {
        const match = this.currentFile.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (match && match[1]) {
        const ext = match[1].toLowerCase();
        mediaType = ext === 'gz' ? 'gz' : ext;
      }
      }

      const formData = new FormData();
      formData.append('algorithm', this.selectedAlgorithm);
      formData.append('media_type', mediaType); // image / video / gz
      formData.append('file', this.currentFile);
      formData.append('id', this.selectedPatient.id);

      // 显示加载提示
      const loading = this.$loading({
        lock: true,
        text: '上传成功，等待算法分析，请勿切换页面',
        background: 'rgba(0, 0, 0, 0.3)',
        customClass: 'custom-loading'
      });

      try {
        await upload(formData).then((res) => {
          if (res.data.code === 1) {
            this.analysisResultUrl = res.data.data.analysisResultUrl;
            this.analysisResult = res.data.data.analysisResult;
            if(res.data.data.originalImageUrl){
              this.imageUrl = res.data.data.originalImageUrl;
            }
            this.$message.success('上传成功,分析完成，查看右侧结果');
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } catch (error) {
        console.error(error);
        this.$message.error('上传失败，文件格式有误，请重试');
      }finally {
        loading.close(); // 关闭加载提示
      }
    },
    // 下载分析图像
    downloadAnalysisResultUrl(url) {
      const previewWindow = window.open('', '_blank');
      previewWindow.location.href = url;
    },
    // 格式化分析结果
    formatAnalysis(result) {
      if (!result) return '';
      let text = `算法类型: ${result.algorithm}\n\n`;

      // 添加 detail 字段
      if (result.detail) {
        text += `分析详情:${result.detail}\n\n`;
      }

      // 添加 emotion 字段
      if (result.emotion) {
        text += '情感分析结果:\n';
        for (const [emotion, value] of Object.entries(result.emotion)) {
          text += `${emotion}: ${(value * 100).toFixed(1)}%\n`;
        }
      }

      return text;
    },

    getAdjustedImageUrl() {
      const baseUrl = this.analysisResultUrl.split('?')[0];
      // 添加时间戳避免浏览器缓存
      return `${baseUrl}?resolution=${this.adjustmentParams.resolution}&contrast=${this.adjustmentParams.contrast}&brightness=${this.adjustmentParams.brightness}&timestamp=${Date.now()}`;
    },

    // 下载分析报告
    downloadAnalysisReport() {
      if (!this.analysisResult) {
        this.$message.error('没有可下载的分析结果');
        return;
      }

      // 将对象转换为格式化的字符串
      const content =  this.formatAnalysis(this.analysisResult);

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analysis_report_${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 录制视频处理
    toggleRecording() {
      if (this.isRecording) {
        this.mediaRecorder.stop();
      } else {
        this.recordedChunks = [];
        const stream = this.$refs.videoPreview.srcObject;
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) this.recordedChunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, {type: 'video/webm'});
          const file = new File([blob], `video_${Date.now()}.webm`, {
            type: 'video/webm'
          });
          this.currentFile = file;
          this.isVideo = true;
          this.videoUrl = URL.createObjectURL(blob); // 生成视频预览地址
          this.isRecording = false;
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      }
    },
    // 处理视频或图片文件
    handleMediaFile(file) {
      // 预览处理
      if (file.type.startsWith('image/')) {
        this.imageUrl = URL.createObjectURL(file);
      } else if (file.type.startsWith('video/')) {
        this.videoUrl = URL.createObjectURL(file);
      }
    },
    // 解析情感数据
    parseEmotionData() {
      const result = this.analysisResult.details;
      const emotions = result.split(', ')
          .filter(item => item.includes('：'))
          .map(item => {
            const [name, value] = item.split('：');
            return {
              name: name.trim(),
              value: parseFloat(value)
            };
          });
      return emotions.slice(1); // 去掉算法类型
    },
    // 显示图表弹窗
    async showEmotionChart() {
      this.chartVisible = true;
      this.$nextTick(() => {
        const chartDom = this.$refs.chartContainer;
        chartDom.style.height = '500px'; // 增加图表高度
        this.initEmotionChart(chartDom);
      });
    },
    // 初始化图表
    initEmotionChart(dom) {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      const emotions = this.analysisResult.emotion;
      const chartData = Object.entries(emotions).map(([name, value]) => ({
        name,
        value: Number((value * 100).toFixed(1))
      }));

      this.chartInstance = echarts.init(dom);
      const option = {
        title: {
          text: `${this.analysisResult.algorithm}分析结果`,
          left: 'center'
        },
        tooltip: {
          formatter: '{b}: {d}%' // 显示百分比
        },
        legend: {
          orient: 'vertical',
          right: 0,
          top: 'middle'
        },
        series: [{
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          data: chartData,
          label: {
            show: true,
            fontSize: 14,
            formatter: '{b}\n{d}%',
            color: '#666'
          },
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      };

      this.chartInstance.setOption(option);
    },

    // 修改initCanvas方法
    async initCanvas() {
      const canvas = this.$refs.previewCanvas;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.analysisResultUrl;

      // eslint-disable-next-line no-return-assign
      await new Promise(resolve => img.onload = resolve);

      // 获取容器尺寸
      const container = canvas.parentElement;
      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight * 0.8; // 留出空间给控制条

      // 计算原始比例
      const scale = Math.min(
          maxWidth / img.width,
          maxHeight / img.height
      ) * (this.adjustmentParams.resolution / 100);

      // 设置画布实际尺寸
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.filter = `
    contrast(${this.adjustmentParams.contrast}%)
    brightness(${this.adjustmentParams.brightness}%)
  `;

      // 清空画布并居中绘制
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
          img,
          0, 0, img.width, img.height, // 源图像尺寸
          0, 0, canvas.width, canvas.height // 目标尺寸（已按比例计算）
      );
    },

    handleParamChange() {
      this.initCanvas();
    },

    showAdjustDialog() { // 在弹窗打开时添加重置操作
      this.adjustmentVisible = true;
      this.$nextTick(() => {
        this.adjustmentParams = { // 重置参数
          resolution: 100,
          contrast: 100,
          brightness: 100
        };
        this.initCanvas();
      });
    },

    async initFun() {
      this.patientPage = 1; // 重置为第一页
      await this.loadPatients();
    },

    async openSelectPatientDialog() {
      this.selectDialogVisible = true;
      await this.loadPatients(); // 使用当前页码加载数据
    },

    async loadPatients() {
      this.loadingPatients = true;
      try {
        const res = await getPatientPage({
          page: this.patientPage,
          pageSize: this.patientPageSize,
          name: this.inputName || undefined, // 支持搜索姓名（可选）
          patientId: this.patientId || undefined // 支持搜索编号（可选）
        });

        if (res.data.code === 1) {
          this.patientList = res.data.data.records || [];
          this.patientTotal = Number(res.data.data.total);
        } else {
          this.$message.error('获取患者列表失败：' + res.data.msg);
          this.patientList = [];
          this.patientTotal = 0;
        }
      } catch (err) {
        this.$message.error('获取患者列表失败：' + res.data.msg);
      } finally {
        this.loadingPatients = false;
      }
    },

    handlePatientSelect(row) {
      this.selectedPatient = row;
      this.selectDialogVisible = false;
    },

    async handleSizeChange(val) {
      this.patientPageSize = val;
      this.patientPage = 1; // 切换每页条数时重置为第一页
      await this.loadPatients();
    },

    async handleCurrentChange(val) {
      this.patientPage = val;
      await this.loadPatients();
    }
  }
};
</script>

<style scoped>
.image-analysis-container {
  height: calc(100vh - 70px); /* 减去导航栏高度 */
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.main-layout {
  flex: 1;
  height: 100%;
  margin: 0 !important; /* 清除element默认边距 */
}

.left-panel, .right-panel {
  height: auto;
  min-height: 100%; /* 确保最小高度为100% */
  display: flex;
  flex-direction: column;
}

.image-upload-section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.algorithm-selection {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-top: auto;
}

.result-image-section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  text-align: center;
  width: 100%;
  margin: 15px;
  padding: 12px 0;
  font-size: 18px;
}

.result-header {
  text-align: center;
  width: 100%;
  margin: 0;
  padding: 12px 0;
  font-size: 18px;
}

.image-preview {
  width: 100%;
  height: 60vh !important;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
}

.image-placeholder {
  width: 100%;
  height: 60vh;
  border: 2px dashed #e4e7ed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #c0c4cc;
  font-size: 16px;
  margin: 10px 0;
}

.analysis-detail >>> .el-textarea__inner {
  font-family: monospace;
  background-color: #f8f9fa;
  line-height: 1.6;
}

.el-image {
  width: auto;
  max-width: 100%;
  margin: 0 auto;
}

.camera-preview {
  width: 300px;
  height: 200px;
  border: 1px solid #ddd;
  margin-top: 10px;
}

.el-button-group {
  margin-right: 10px;
}

.camera-controls {
  margin-bottom: 15px;
  display: flex;
  align-items: center;

}

.upload-demo {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.camera-preview-container {
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.camera-preview {
  width: 80%;
  max-width: 500px;
  height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #000;
  object-fit: cover; /* 保持视频比例 */
}

/* 图表弹窗样式 */
:deep(.chart-dialog) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-dialog__header {
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;

    .el-dialog__title {
      font-size: 18px;
      color: #303133;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .adjustment-controls {
    padding: 0 20px;
  }

  .adjust-item {
    margin-bottom: 25px;
  }

  .adjust-item span {
    margin-bottom: 8px;
    display: block;
    color: #606266;
  }

  canvas {
    width: 100%;
    height: auto;
    margin: 0 auto;
  }

}

.patient-select-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.el-table {
  flex: 1;
}

.el-pagination {
  margin-top: 16px;
  text-align: center;
}

/* 弹窗自定义样式 */
:deep(.upload-guide-dialog .el-dialog) {
  max-width: 200px;
  margin: 20px auto;
}


</style>
