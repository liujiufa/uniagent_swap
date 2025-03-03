import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import "../assets/style/componentsStyle/PriceChart.scss";
import { tokenList } from "../view/Swap";
import styled from "styled-components";
import { FlexBox, FlexSBCBox } from "./FlexBox";
import { getKineData } from "../API";
import { dateFormat } from "../utils/tool";
import nodata from "../assets/image/Swap/nodata.png";

const CoinInfo = styled(FlexBox)`
  align-items: center;
  justify-content: flex-start;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  -webkit-letter-spacing: 0em;
  -moz-letter-spacing: 0em;
  -ms-letter-spacing: 0em;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  img {
    width: 48px;
    height: 48px;
  }
  > span {
    margin: 0px 12px;
    font-family: "Space Grotesk";
    font-size: 24px;
    font-weight: bold;
    line-height: normal;
    -webkit-letter-spacing: 0em;
    -moz-letter-spacing: 0em;
    -ms-letter-spacing: 0em;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    font-size: 14px;

    img {
      width: 24px;
      height: 24px;
    }
    > span {
      margin: 0px 6px;

      font-size: 14px;
    }
  }
`;
const PriceBox = styled.div`
  font-size: 28px;
  font-weight: bold;
  line-height: normal;
  -webkit-letter-spacing: 0em;
  -moz-letter-spacing: 0em;
  -ms-letter-spacing: 0em;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #fff;
  margin-top: 20px;
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;
const TimeTabs = styled(FlexSBCBox)`
  width: fit-content;
  border-radius: 20px;
  opacity: 1;
  background: #0a0a0a;
  box-sizing: border-box;
  border: 1px solid #685319;
  padding: 7px;
  margin-top: 20px;
  div {
    cursor: pointer;
    font-family: "Space Grotesk";
    font-size: 12px;
    font-weight: bold;
    line-height: normal;
    text-align: center;
    -webkit-letter-spacing: 0em;
    -moz-letter-spacing: 0em;
    -ms-letter-spacing: 0em;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin: 0px 7px;
    padding: 4px 12px;
    border-radius: 12px;
  }
  .active {
    background: #f4c134;
  }
  @media (max-width: 768px) {
    border-radius: 18px;
    padding: 4px;
    margin-top: 15px;

    div {
      margin: 0px 5px;

      padding: 2px 6px;
      border-radius: 10px;
    }
  }
`;

const NoData = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Space Grotesk";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #666666;
  > img {
    width: 44px;
    height: 44px;
    margin: 8px;
  }
`;
export default function PriceChart(props: any) {
  const [Time, setTime] = useState<any>(1);
  const [TimeString, setTimeString] = useState<any>([]);
  const [ChartData, setChartData] = useState<any>([]);
  let TokenObj: any = tokenList?.find(
    (item: any) => String(item?.name) === String(props?.coinName)
  );
  let getOption = () => {
    let option = {
      xAxis: {
        data: TimeString,
        // 隐藏x轴
        axisLine: {
          show: false,
        },
        // 刻度线
        axisTick: {
          show: false,
        },
        // axisPointer: {
        //   //   snap: true,
        //   type: "shadow",
        // },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#f4c134",
        borderColor: "transparent",
        textStyle: {
          color: "#fff",
        },
        axisPointer: {
          type: "cross",
          animation: false,
          label: {
            backgroundColor: "#f4c134",
            borderColor: "none",
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            color: "#fff",
          },
        },
        formatter: function (params: any) {
          // debugger;
          return params[0]?.value + "<br />" + params[0]?.axisValue;
        },
      },
      yAxis: {
        type: "value",
        // 去除网格线
        splitLine: false,
        // 刻度线
        axisTick: {
          show: false,
        },
        // 隐藏y轴
        axisLine: {
          show: false,
        },
        // 隐藏刻度值
        axisLabel: {
          //   show: false,
        },
        tooltip: {
          backgroundColor: "rgba(50,50,50,0.7)",
          axisPointer: {
            snap: true,
            type: "shadow",
          },
        },
      },
      grid: {
        left: "0%",
        right: "0%",
        bottom: "3%",
        top: "20px",
        containLabel: true,
      },

      series: [
        {
          data: ChartData.map((item: any) => item.price),
          type: "line",
          smooth: true,
          showSymbol: false,

          itemStyle: {
            color: "#f4c134",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#f4c134",
                },
                {
                  offset: 1,
                  color: "rgba(0, 0, 0, 0.1)",
                },
              ],
              global: false,
            },
          },
          label: {
            color: "#f4c134",
          },
        },
      ],
    };
    return option;
  };

  useEffect(() => {
    if (!!props?.coinName) {
      getKineData(props?.coinName, Time).then((res: any) => {
        setChartData(res?.data || []);
        if (Number(Time) === 1) {
          setTimeString(
            res?.data.map((item: any) =>
              dateFormat("mm-dd HH:MM", new Date(item.createTime))
            )
          );
        } else {
          setTimeString(
            res?.data.map((item: any) =>
              dateFormat("mm-dd", new Date(item.createTime))
            )
          );
        }
      });
    }
  }, [props?.coinName, Time]);

  return (
    <div className="wrapper">
      <CoinInfo>
        <img src={TokenObj?.icon} alt="" /> <span>{TokenObj?.symbol}</span>
        {TokenObj?.name}
      </CoinInfo>
      {ChartData.map((item: any) => item.price)?.length > 0 && (
        <PriceBox>
          $
          {
            ChartData.map((item: any) => item.price)[
              ChartData.map((item: any) => item.price)?.length - 1
            ]
          }
        </PriceBox>
      )}
      {ChartData.map((item: any) => item.price)?.length > 0 ? (
        <>
          <ReactEcharts option={getOption()} style={{ height: "400px" }} />
          <TimeTabs>
            <div
              className={Number(Time) === 1 ? "active" : ""}
              onClick={() => {
                setTime(1);
              }}
            >
              1D
            </div>
            <div
              className={Number(Time) === 7 ? "active" : ""}
              onClick={() => {
                setTime(7);
              }}
            >
              1W
            </div>
            <div
              className={Number(Time) === 30 ? "active" : ""}
              onClick={() => {
                setTime(30);
              }}
            >
              1M
            </div>
          </TimeTabs>
        </>
      ) : (
        <NoData>
          <img src={nodata} alt="" />
        </NoData>
      )}
    </div>
  );
}
