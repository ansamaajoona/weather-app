/* 
    Third party libraries
*/
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


export default function Chart({ options }: any) {
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            className="max-h-max"
        />
    )
}
