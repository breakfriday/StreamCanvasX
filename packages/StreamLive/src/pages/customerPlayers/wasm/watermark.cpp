#ifndef EM_PORT_API
#	if defined(__EMSCRIPTEN__)
#		include <emscripten.h>
#		if defined(__cplusplus)
#			define EM_PORT_API(rettype) extern "C" rettype EMSCRIPTEN_KEEPALIVE
#		else
#			define EM_PORT_API(rettype) rettype EMSCRIPTEN_KEEPALIVE
#		endif
#	else
#		if defined(__cplusplus)
#			define EM_PORT_API(rettype) extern "C" rettype
#		else
#			define EM_PORT_API(rettype) rettype
#		endif
#	endif
#endif

#include<iostream>
#include<stdio.h>
# include<stdlib.h>
#include<math.h>
#include<string.h>

#define NUM 4

#define PI 3.1415926


EM_PORT_API(int) around(double a)
{
    if(a >= 0)
    {
        return int(a+0.5);
    }
    else
    {
        return int(a-0.5);
    }
 
}

EM_PORT_API(void) DCT(int data[NUM][NUM])
{
    int output[NUM][NUM];
    double alpha,beta;//C(k)  C(l)
    int m=0,n=0,k=0,l=0;
    for(k = 0;k < NUM;k++)
    {
        for(l = 0;l < NUM;l++)
        {
            if(k == 0)
            {
                alpha = sqrt(1.0/NUM);
            }
            else
            {
                alpha = sqrt(2.0/NUM);
            }
            if(l == 0)
            {
                beta = sqrt(1.0/NUM);
            }
            else
            {
                beta = sqrt(2.0/NUM);
            }
            double temp = 0.0;
            for(m = 0;m < NUM;m++)
            {
                for(n = 0;n < NUM;n++)
                {
                    temp += data[m][n] * cos((2*m+1)*k*PI/(2.0*NUM)) * cos((2*n+1)*l*PI/(2.0*NUM));
                }
            }
            output[k][l] = around(alpha * beta *temp);
        }
    }
    memset(data,0,sizeof(int)*NUM*NUM);
    memcpy(data,output,sizeof(int)*NUM*NUM);
 
}
//Inverse DCT
EM_PORT_API(void) IDCT(int data[NUM][NUM])
{
    int output[NUM][NUM];
    double alpha,beta;
    int m=0,n=0,k=0,l=0;
    for(m = 0;m < NUM;m++)
    {
        for(n = 0;n < NUM;n++)
        {
            double temp = 0.0;
            for(k = 0;k < NUM;k++)
            {
                for(l = 0;l < NUM;l++)
                {
                    if(k == 0)
                    {
                        alpha = sqrt(1.0/NUM);
                    }
                    else
                    {
                        alpha = sqrt(2.0/NUM);
                    }
                    if(l == 0)
                    {
                        beta = sqrt(1.0/NUM);
                    }
                    else
                    {
                        beta = sqrt(2.0/NUM);
                    }
 
                    temp += alpha * beta * data[k][l] * cos((2*m+1)*k*PI/(2*NUM)) * cos((2*n+1)*l*PI/(2*NUM));
 
                }
            }
            output[m][n] = around(temp);
        }
    }
    memset(data,0,sizeof(int)*NUM*NUM);
    memcpy(data,output,sizeof(int)*NUM*NUM);
 
}


EM_PORT_API(void) myArnold(unsigned char* data, int size, int count) {

    unsigned char pixelData[size * size * 4];

    while (count > 0){
      for(int index = 0 ; index < size*size*4 ; index ++){
        int oldX = (index >> 2) % ( size ) ;
        int oldY = (index >> 2) / ( size ) ;
        int newX = (oldX + oldY)%(size );
        int newY = (oldX + 2 * oldY)%(size );
        for(int i = 0 ; i < 4 ; i++){
        pixelData[newY * (size <<2) + (newX << 2) +i] = data[oldY * (size << 2) + (oldX << 2) +i ];
        }
      }

      for(int i = 0 ; i < size*size*4 ; i++){
        data[i] = pixelData[i];
      }
      
      count--;
    }

  }

EM_PORT_API(void) myIArnold(unsigned char* data, int size, int count) {

    unsigned char pixelData[size * size * 4];

    while (count > 0){
        for(int index = 0 ; index < size*size*4 ; index ++){
        int oldX = (index >> 2) % ( size ) ;
        int oldY = (index >> 2) / ( size ) ;
        int newX = (2 * oldX - oldY)%(size );
        int newY = (-oldX + oldY)%(size );
        newX = (newX + size)%(size);
        newY = (newY + size)%(size);
        for(int i = 0 ; i < 4 ; i++){
        pixelData[newY * (size <<2) + (newX << 2) +i] = data[oldY * (size << 2) + (oldX << 2) +i ];
        }
      }
      for(int i = 0 ; i < size*size*4 ; i++){
        data[i] = pixelData[i];
      }

      count--;
    }

  }


EM_PORT_API(void) watermarkArnoldDCT(unsigned char* imgData, int width, int height,unsigned char* watermarkData, int size, int count){

  myArnold(watermarkData,size,count);

  // for(int Y = 0; Y < (height>>2); Y++){
  //   for(int X = 0; X < (width>>3); X++){
  for(int Y = 0; Y < size; Y++){
    for(int X = 0; X < size; X++){   
      int imgY[NUM][NUM];
      int imgU[NUM][NUM];
      int imgV[NUM][NUM];

      // YUV
      for(int x = 0; x < NUM; x++){
        for(int y= 0; y < NUM; y++){
          imgY[x][y]=0.299*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]
                    +0.587*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]
                    +0.114*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2];
          imgU[x][y]=-0.147*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]
                    -0.289*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]
                    +0.436*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2];
          imgV[x][y]=0.615*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]
                    -0.515*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]
                    -0.100*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2];  
        }
      }

      DCT(imgY);
      DCT(imgU);
      DCT(imgV);


      //   // R    Y
      // if(imgY[2+y][3-y]/imgY[3-y][2+y] < 1.1 || imgY[2+y][3-y]/imgY[3-y][2+y] > 1/1.1)
      // if((imgY[2+y][3-y] > imgY[3-y][2+y] && imgY[2+y][3-y]/(imgY[3-y][2+y]+1e6) < 1.5 )
      //   ||(imgY[2+y][3-y]< imgY[3-y][2+y] && imgY[2+y][3-y]/(imgY[3-y][2+y]+1e6) > 1/1.5))
      // {
      if(watermarkData[(X<<2)+(Y*size<<2)] <= 128){
        if(imgY[2][3]%256 < imgY[3][2]%256){
          int temp = imgY[2][3];
          imgY[2][3] = imgY[3][2];
          imgY[3][2] = temp;
          if((imgY[3][2] - 1)%256 < imgY[3][2]%256){
            imgY[3][2] = imgY[3][2] - 1;
          }
        }
        else{
          if((imgY[3][2] - 1)%256 < imgY[3][2]%256 ){
            imgY[3][2] = imgY[3][2] - 1;
          }
        }
      }
      else{
        if(imgY[2][3]%256 >= imgY[3][2]%256){
          int temp = imgY[2][3];
          imgY[2][3] = imgY[3][2];
          imgY[3][2] = temp;
          if((imgY[2][3] - 1)%256 < imgY[2][3]%256){
            imgY[2][3] = imgY[2][3] - 1;
          }
        }
        else{
          if((imgY[2][3] - 1)%256 < imgY[2][3]){
            imgY[2][3] = imgY[2][3] - 1;
          }
        }

      }
      // }
    
      // //  G  U
      // for(int y = 0 ; y < 1 ; y++){
      //   if(watermarkData[(X<<2)+((Y)* size<<2)] >= 128){
      //     if(imgU[2+y][3-y]%256 < imgU[3-y][2+y]%256){
      //       int temp = imgU[2+y][3-y];
      //       imgU[2+y][3-y] = imgU[3-y][2+y];
      //       imgU[3-y][2+y] = temp;

      //       // imgU[2+y][3-y] = imgU[2+y][3-y] +128;
      //       if((imgU[3-y][2+y]-1)%256 < imgU[3-y][2+y]%256){
      //         imgU[3-y][2+y] = imgU[3-y][2+y] -1;
      //       }
      //     }
      //     else{
      //       // imgU[2+y][3-y] = imgU[2+y][3-y] + 4;
      //       if((imgU[3-y][2+y] - 1)%256 < imgU[3-y][2+y]%256 ){
      //         imgU[3-y][2+y] = imgU[3-y][2+y] -1;
      //       }
      //       // imgU[2+y][3-y] = imgU[2+y][3-y] +128;
      //     }
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)]=1;
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)+1]=1;
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)+2]=1;
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)+3]=1;
      //   }
      //   else{
      //     if(imgU[2+y][3-y]%256 >= imgU[3-y][2+y]%256){
      //       int temp = imgU[2+y][3-y];
      //       imgU[2+y][3-y] = imgU[3-y][2+y];
      //       imgU[3-y][2+y] = temp;
      //       // imgU[3-y][2+y] = imgU[3-y][2+y] + 128;
      //       if((imgU[2+y][3-y] - 1)%256 < imgU[2+y][3-y]%256){
      //         imgU[2+y][3-y] = imgU[2+y][3-y] - 1;
      //       }
      //     }
      //     else{
      //       if((imgU[2+y][3-y] - 1)%256 < imgU[2+y][3-y]){
      //         imgU[2+y][3-y] = imgU[2+y][3-y] - 1;
      //       }
      //       // imgU[3-y][2+y] = imgU[3-y][2+y] + 128;
      //     }
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)]=1;
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)+1]=1;
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)+2]=1;
      //     // watermarkData[(X<<2)+((2*Y+y)*size<<2)+3]=1;
      //   }

      // }

      IDCT(imgY);
      IDCT(imgU);
      IDCT(imgV);

      // YUV
      for(int x = 0; x < NUM; x++){
        for(int y= 0; y < NUM; y++){
          int tempR = imgY[x][y]+1.14*imgV[x][y];
          tempR = tempR > 255 ? 255 : (tempR < 0 ? 0 : tempR);
          imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]=tempR;
          // imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]=imgY[x][y];
          // imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2]=imgY[x][y];
          // imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+3]=(unsigned char)255;
          imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+3]=(unsigned char)255;   
          int tempG = imgY[x][y]-0.395*imgU[x][y]-0.581*imgV[x][y];
          tempG = tempG > 255 ? 255 : (tempG < 0 ? 0 : tempG);
          imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]=tempG;
          int tempB = imgY[x][y]+2.032*imgU[x][y]; 
          tempB = tempB > 255 ? 255 : (tempB < 0 ? 0 : tempB);
          imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2]=tempB; 
        }
      }
  
    }

  }


}

EM_PORT_API(void) watermarkArnoldIDCT(unsigned char* imgData, int width, int height,unsigned char* watermarkData, int size, int count){
  unsigned char watermarkPixelData[size * size * 4];
  // for(int Y = 0; Y < (height>>2); Y++){
  //   for(int X = 0; X < (width>>3); X++){  
  for(int Y = 0; Y < size; Y++){
    for(int X = 0; X < size; X++){    
      int imgY[NUM][NUM];
      int imgU[NUM][NUM];
      int imgV[NUM][NUM];

      // YUV
      for(int x = 0; x < NUM; x++){
        for(int y= 0; y < NUM; y++){
          imgY[x][y]=0.299*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]
                    +0.587*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]
                    +0.114*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2];
          imgU[x][y]=-0.147*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]
                    -0.289*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]
                    +0.436*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2];
          imgV[x][y]=0.615*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)]
                    -0.515*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+1]
                    -0.100*imgData[((X*NUM+x)<<2)+((Y*NUM+y)*width<<2)+2];  
        }
      }

      DCT(imgY);
      DCT(imgU);
      DCT(imgV);

      // R Y

      if((imgY[2][3])%256 < (imgY[3][2])%256){
        watermarkPixelData[(X<<2)+(Y*size<<2)] =255;
      }
      else{
        watermarkPixelData[(X<<2)+(Y*size<<2)] = 0; 
      }
    }
  }

  for(int i = 0 ; i < size*size ; i++){
    watermarkData[4*i ] = watermarkPixelData[4*i];
    watermarkData[4*i + 1] = watermarkPixelData[4*i];
    watermarkData[4*i + 2] = watermarkPixelData[4*i];
    watermarkData[4*i + 3] = (unsigned char)255;
  }

  myIArnold(watermarkData, size, count);

}

// int main(){
//   unsigned char imgData[320000];
//   unsigned char watermarkData[10000];
//   memset(imgData,0,sizeof(unsigned char)*320000);
//   memset(watermarkData,0,sizeof(unsigned char)*10000);

//   watermarkArnoldDCT(imgData,400,200,watermarkData,50,8);
//   watermarkArnoldIDCT(imgData,400,200,watermarkData,50,8);

//   return 0;

// }


// int main()
// {
//     // timeb t1,t2;
//     // ftime(&t1);
//     // int input[NUM][NUM] =
//     //      {
//     //                {89, 101, 114, 125, 126, 115, 105, 96,89, 101, 114, 125, 126, 115, 105, 96},
//     //                {97, 115, 131, 147, 149, 135, 123, 113,97, 115, 131, 147, 149, 135, 123, 113},
//     //                {114, 134, 159, 178, 175, 164, 149, 137,114, 134, 159, 178, 175, 164, 149, 137},
//     //                {121, 143, 177, 196, 201, 189, 165, 150,121, 143, 177, 196, 201, 189, 165, 150},
//     //                {119, 141, 175, 201, 207, 186, 162, 144,119, 141, 175, 201, 207, 186, 162, 144},
//     //                {107, 130, 165, 189, 192, 171, 144, 125,107, 130, 165, 189, 192, 171, 144, 125},
//     //                {97, 119, 149, 171, 172, 145, 117, 96,97, 119, 149, 171, 172, 145, 117, 96},
//     //                {88, 107, 136, 156, 155, 129, 97, 75,88, 107, 136, 156, 155, 129, 97, 75},
//     //                {89, 101, 114, 125, 126, 115, 105, 96,89, 101, 114, 125, 126, 115, 105, 96},
//     //                {97, 115, 131, 147, 149, 135, 123, 113,97, 115, 131, 147, 149, 135, 123, 113},
//     //                {114, 134, 159, 178, 175, 164, 149, 137,114, 134, 159, 178, 175, 164, 149, 137},
//     //                {121, 143, 177, 196, 201, 189, 165, 150,121, 143, 177, 196, 201, 189, 165, 150},
//     //                {119, 141, 175, 201, 207, 186, 162, 144,119, 141, 175, 201, 207, 186, 162, 144},
//     //                {107, 130, 165, 189, 192, 171, 144, 125,107, 130, 165, 189, 192, 171, 144, 125},
//     //                {97, 119, 149, 171, 172, 145, 117, 96,97, 119, 149, 171, 172, 145, 117, 96},
//     //                {88, 107, 136, 156, 155, 129, 97, 75,88, 107, 136, 156, 155, 129, 97, 75}
//     //      };
//         int input[NUM][NUM] =
//          {
//                    {89, 101, 114, 125, 126, 115, 105, 96},
//                    {97, 115, 131, 147, 149, 135, 123, 113},
//                    {114, 134, 159, 178, 175, 164, 149, 137},
//                    {121, 143, 177, 196, 201, 189, 165, 150},
//                    {119, 141, 175, 201, 207, 186, 162, 144},
//                    {107, 130, 165, 189, 192, 171, 144, 125},
//                    {97, 119, 149, 171, 172, 145, 117, 96},
//                    {88, 107, 136, 156, 155, 129, 97, 75}
//          };
//     DCT(input);
//     std::cout << "The result of DCT is:\n";
//     for(int i = 0;i < NUM;i++)
//     {
//         for(int j = 0;j < NUM;j++)
//         {
//             std::cout << input[i][j] << '\t';
//         }
//         std::cout << '\n';
//     }
//     input[7][6]=3;
//     input[6][7]=-3;
//     // for(int i = 5;i < NUM;i++){
//     //   for(int j = 5;j < NUM;j++){
//     //     input[i][j] = (i+j)%2 ? -4 : 4;
//     //   }
//     // }
//     IDCT(input);
//     std::cout << "The result of IDCT is:\n";
//     for(int i = 0;i < NUM;i++){
//         for(int j = 0;j < NUM;j++){
//             std::cout << input[i][j] << '\t';
//         }
//         std::cout << '\n';
//     }

//     DCT(input);
//     std::cout << "The result of DCT is:\n";
//     for(int i = 0;i < NUM;i++)
//     {
//         for(int j = 0;j < NUM;j++)
//         {
//             std::cout << input[i][j] << '\t';
//         }
//         std::cout << '\n';
//     }
//     // for(int i = 0;i < NUM;i++)
//     // {
//     //     for(int j = 0;j < NUM;j++)
//     //     {
//     //         cout << input2[i][j] - input[i][j] << '\t';
//     //     }
//     //     cout << '\n';
//     // }

// 	// ftime(&t2);
//   //   long tt =(t2.millitm - t1.millitm)?
//   //       (t2.time - t1.time)*1000 + (t2.millitm - t1.millitm):
//   //       (t2.time - t1.time-1)*1000 + (t2.millitm - t1.millitm);
//   //   std::cout << "耗时"<<tt << '\n';
//     return 0;
// }