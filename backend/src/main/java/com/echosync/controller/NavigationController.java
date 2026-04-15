package com.echosync.controller;

import com.echosync.model.Node;
import com.echosync.service.PathfindingService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/navigation")
@CrossOrigin(origins = "*") // Allows React frontend to call this locally
public class NavigationController {

    private final PathfindingService pathfindingService;

    public NavigationController(PathfindingService pathfindingService) {
        this.pathfindingService = pathfindingService;
    }

    @PostMapping("/path")
    public Mono<List<Node>> getPath(@RequestBody NavigationRequest request) {
        return pathfindingService.calculateOptimalPath(
                request.getStartNodeId(), 
                request.getEndNodeId(), 
                request.getCrowdDensityWeights()
        );
    }

    // Inner DTO Class
    public static class NavigationRequest {
        private String startNodeId;
        private String endNodeId;
        private Map<String, Double> crowdDensityWeights;

        public String getStartNodeId() { return startNodeId; }
        public void setStartNodeId(String startNodeId) { this.startNodeId = startNodeId; }

        public String getEndNodeId() { return endNodeId; }
        public void setEndNodeId(String endNodeId) { this.endNodeId = endNodeId; }

        public Map<String, Double> getCrowdDensityWeights() { return crowdDensityWeights; }
        public void setCrowdDensityWeights(Map<String, Double> crowdDensityWeights) { this.crowdDensityWeights = crowdDensityWeights; }
    }
}
