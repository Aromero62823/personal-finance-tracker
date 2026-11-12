import Plot from 'react-plotly.js'
import { useEffect, useState } from 'react'

export default function Chart () {
    const[chart, setChart] = useState(null);

    // Calling the plotly graph from the django backend
    useEffect(() => {
        fetch('/api/plotData/')
        .then(res => res.json())
        .then(data => setChart(data))
    }, []);

    if(!chart) {
        return (<p>No Chart Available</p>)
    } else {
        return (
            <>

            <div className="graph-placeholder" id="plot_graph">
                <Plot data={chart.data} layout={chart.layout} style={{width: '100%'}}/>
            </div>

            </>
        )
    }
}